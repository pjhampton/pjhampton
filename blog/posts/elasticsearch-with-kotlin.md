---
title: 'Elasticsearch with Kotlin'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2023-Nov-23'
show_post_footer: true
excerpt: >
  
---

The Java Elasticsearch client was redesigned in Elasticsearch 8, followed with the deprecation of the high-level client. The client was also decoupled from the Elasticsearch codebase and given its [own repo](https://github.com/elastic/elasticsearch-java). My team and I recently rewrote a data pipeline that required a set of Kotlin services to index time-series data into quite a large (many-TB) Elasticsearch cluster.

This post is a quick overview of how to use the Elasticsearch Java client with Kotlin - a list of reference examples I wish I had when we started the project. I am running Kotlin 1.9.20 and Gradle 7.6.1, with Elasticsearch 8.11.1, on a M2 Macbook Pro with 16GB of RAM. The data I used was the sample eCommerce orders from the Kibana example datasets.

## Setting up

3 dependencies are required for setting up. The lastest version at time of writing was of the Elasticsearch client is 8.11.1, in which versions are tied to stack releases. You will also need the Jackson Databind library which is used by the Java API client to de/serialize JSON in and out of their POJO representations. The last dependency that is required is the Jackson Kotlin module, which is used to configure the Jackson Databind library to work nicely with Kotlin features such as data classes, default values, nullable types, etc.

```kotlin
dependencies {
    implementation("co.elastic.clients:elasticsearch-java:8.11.1")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.12.7.1")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.15.3")
}
```

And to create a syncronous Elasticsearch client in Kotlin you can implement the following code.
Setting up a `RestClient` is the first step, along with providing sensitive material to authenticate with the remote server.
A `RestClientTransport` is then created with the `RestClient` object and a configured JSON mapper. Using the Kotlin module the JSON mapper is configured to be quite permissive with null values.

```kotlin
object ElasticCloudClientFactory {
    private const val REFLECTION_CACHE_SIZE = 512

    fun create(): ElasticsearchClient {
        val restClient = RestClient
            .builder(HttpHost("localhost", 9200, "http"))
            .setDefaultHeaders(
                arrayOf(
                    BasicHeader("Authorization", "ApiKey 🤐")
                )
            )
            .build()
        val transport = RestClientTransport(
            restClient,
            JacksonJsonpMapper(
                jacksonObjectMapper()
                    .registerModule(
                        KotlinModule.Builder()
                            .withReflectionCacheSize(REFLECTION_CACHE_SIZE)
                            .configure(KotlinFeature.NullToEmptyCollection, false)
                            .configure(KotlinFeature.NullToEmptyMap, false)
                            .configure(KotlinFeature.NullIsSameAsDefault, false)
                            .configure(KotlinFeature.SingletonSupport, false)
                            .configure(KotlinFeature.StrictNullChecks, false)
                            .build(),
                    ),
            ),
        )

        return ElasticsearchClient(transport)
    }
}

fun main() {
    val esClient = ElasticCloudClientFactory.create()

    println("Elasticsearch Reachable: " + esClient.ping().value())
    println(esClient.info())

    // Elasticsearch Reachable: true
    // InfoResponse: {"cluster_name":"elasticsearch","cluster_uuid":"0gdDiq95T_-yMm3VEyL1SQ","name":"Petes-Work.local","tagline":"You Know, for Search","version":{"build_date":"2023-11-15T14:05:29.925748767Z","build_flavor":"default","build_hash":"a120650ece1ee5ebb3cd0a4d0af3abbe7af9e962","build_snapshot":true,"build_type":"tar","lucene_version":"9.8.0","minimum_index_compatibility_version":"7.0.0","minimum_wire_compatibility_version":"7.17.0","number":"8.12.0-SNAPSHOT"}}
}
```

The `ElasticsearchClient` class is the main entry point for interacting with Elasticsearch. This client is what will be used for the below code examples except when we get to asyncronous searching.

### List Indicies

To use the cat API to list the indices in Elasticsearch can chain the method calls `cat().indicies()` together. In this example I list the indices in Elasticsearch and print them to Stdout.

```kotlin
val idxResponse = esClient.cat().indices()

for (index in idxResponse.valueBody())
    println(index)

// IndicesRecord: {"health":"yellow","status":"open","index":"kibana_sample_data_flights","uuid":"FCGuGCyqRqyS2cS4wvP2uQ","pri":"1","rep":"1","docs.count":"13014","docs.deleted":"0","store.size":"5.6mb","pri.store.size":"5.6mb"}
// IndicesRecord: {"health":"green","status":"open","index":"kibana_sample_data_logstsdb","uuid":"dMbvGuMHQdWVgh7xApxoHw","pri":"1","rep":"0","docs.count":"14068","docs.deleted":"0","store.size":"7.6mb","pri.store.size":"7.6mb"}
// IndicesRecord: {"health":"yellow","status":"open","index":"kibana_sample_data_ecommerce","uuid":"rCR0y-AsS0GurCuFXPChFw","pri":"1","rep":"1","docs.count":"4675","docs.deleted":"0","store.size":"3.9mb","pri.store.size":"3.9mb"}
// ...
```

### Query

Someone from a non-statically typed background might be used to building Elasticsearch queries in JSON, and then submitting them to the cluster. This is possible with the client. Here I build a match all query and submit create a `SearchRequest` object using the Fluent DSL. I then submit the request to Elasticsearch and print the response to Stdout.

```kotlin
val jsonQuery = """
    {
        "query": {
            "match_all": {}
        }
    }""".trimIndent()

val jsonRequest =
    SearchRequest.of { s ->
        s.index("kibana_sample_data_ecommerce")
            .withJson(
                StringReader(jsonQuery))
    }

val response = esClient.search(jsonRequest, Void::class.java)
println(response)

// SearchResponse: {"took":3,"timed_out":false,"_shards":{"failed":0.0,"successful":1.0,"total":1.0,"skipped":0.0},"hits":{"total":{"relation":"eq","value":4675},"hits":[{"_index":"kibana_sample_data_ecommerce","_id":"kBo_2IsBN0Vz35v8sV_W","_score":1.0},{"_index":"kibana_sample_data_ecommerce","_id":"kRo_2IsBN0Vz35v8sV_W","_score":1.0},{"_index":"kibana_sample_data_ecommerce","_id":"kho_2IsBN0Vz35v8sV_W","_score":1.0},{"_index":"kibana_sample_data_ecommerce","_id":"kxo_2IsBN0Vz35v8sV_W","_score":1.0},{"_index":"kibana_sample_data_ecommerce","_id":"lBo_2IsBN0Vz35v8sV_W","_score":1.0},{"_index":"kibana_sample_data_ecommerce","_id":"lRo_2IsBN0Vz35v8sV_W","_score":1.0},{"_index":"kibana_sample_data_ecommerce","_id":"lho_2IsBN0Vz35v8sV_W","_score":1.0},{"_index":"kibana_sample_data_ecommerce","_id":"lxo_2IsBN0Vz35v8sV_W","_score":1.0},{"_index":"kibana_sample_data_ecommerce","_id":"mBo_2IsBN0Vz35v8sV_W","_score":1.0},{"_index":"kibana_sample_data_ecommerce","_id":"mRo_2IsBN0Vz35v8sV_W","_score":1.0}],"max_score":1.0}}
```

A more convinenant, and strongly typed way of building the query would be to use the Fluent DSL. Particularly if you know the structure of the data ahead of time, and isn't likely to dynaically change.

```kotlin
val request = SearchRequest.of { s ->
    s.index("kibana_sample_data_ecommerce")
        .size(10)
        .query { q -> q.matchAll { m -> m.queryName("matchAll") } }
}

val response = esClient.search(request, Void::class.java)
println(response)

// SearchResponse: {"took":2,"timed_out":false,"_shards":{"failed":0.0,"successful":1.0,"total":1.0,"skipped":0.0},"hits":{"total":{"relation":"eq","value":4675},"hits":[{"_index":"kibana_sample_data_ecommerce","_id":"kBo_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]},{"_index":"kibana_sample_data_ecommerce","_id":"kRo_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]},{"_index":"kibana_sample_data_ecommerce","_id":"kho_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]},{"_index":"kibana_sample_data_ecommerce","_id":"kxo_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]},{"_index":"kibana_sample_data_ecommerce","_id":"lBo_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]},{"_index":"kibana_sample_data_ecommerce","_id":"lRo_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]},{"_index":"kibana_sample_data_ecommerce","_id":"lho_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]},{"_index":"kibana_sample_data_ecommerce","_id":"lxo_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]},{"_index":"kibana_sample_data_ecommerce","_id":"mBo_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]},{"_index":"kibana_sample_data_ecommerce","_id":"mRo_2IsBN0Vz35v8sV_W","_score":1.0,"matched_queries":[""]}],"max_score":1.0}}
```

You can also create Kotlin data classes to represent the data indexed by Elasticsearch. This allows you to work with the data in a strongly typed way, however for this blog post, I have shortened things using the `@JsonNaming` and `@JsonIgnoreProperties` annotations.

```kotlin
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
@JsonIgnoreProperties(ignoreUnknown = true)
data class Product(
    @JsonProperty("_id")
    val id: String,
    val basePrice: BigDecimal,
    val discountPercentage: BigDecimal,
    val quantity: Int,
    val manufacturer: String,
    val taxAmount: BigDecimal,
    val productId: Int,
    // and so on...
)

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy::class)
@JsonIgnoreProperties(ignoreUnknown = true)
data class Order(
    val category: List<String>,
    val currency: String,
    val customerFirstName: String,
    val customerFullName: String,
    val customerGender: String,
    val products: List<Product>
    // and so on...
)

val request =
    SearchRequest.of { s ->
        s.index("kibana_sample_data_ecommerce").size(1).query { q ->
            q.matchAll { m -> m.queryName("matchAll") }
        }
    }

val response = esClient.search(request, Order::class.java)

// SearchResponse: {"took":8,"timed_out":false,"_shards":{"failed":0.0,"successful":1.0,"total":1.0,"skipped":0.0},"hits":{"total":{"relation":"eq","value":4675},"hits":[{"_index":"kibana_sample_data_ecommerce","_id":"3KrW8YsBPrmP91v7K9Ap","_score":1.0,"matched_queries":["matchAll"],"_source":"Order(category=[Men's Clothing], currency=EUR, customerFirstName=Eddie, customerFullName=Eddie Underwood, customerGender=MALE, customerId=38, customerLastName=Underwood, customerPhone=, dayOfWeek=Monday, dayOfWeekI=0, email=eddie@underwood-family.zzz, manufacturer=[Elitelligence, Oceanavigations], orderDate=2023-12-04T09:28:48+00:00, orderId=584677, sku=[ZO0549605496, ZO0299602996], products=[Product(id=sold_product_584677_6283, basePrice=11.99, discountPercentage=0, quantity=1, manufacturer=Elitelligence, taxAmount=0, productId=6283, category=Men's Clothing, sku=ZO0549605496, taxlessPrice=11.99, unitDiscountAmount=0, minPrice=6.35, discountAmount=0, createdOn=2016-12-26T09:28:48+00:00, productName=Basic T-shirt - dark blue/white, price=11.99, taxfulPrice=11.99, baseUnitPrice=11.99), Product(id=sold_product_584677_19400, basePrice=24.99, discountPercentage=0, quantity=1, manufacturer=Oceanavigations, taxAmount=0, productId=19400, category=Men's Clothing, sku=ZO0299602996, taxlessPrice=24.99, unitDiscountAmount=0, minPrice=11.75, discountAmount=0, createdOn=2016-12-26T09:28:48+00:00, productName=Sweatshirt - grey multicolor, price=24.99, taxfulPrice=24.99, baseUnitPrice=24.99)])"}],"max_score":1.0}}

response.hits().hits().forEach {
    val msg = "Full Name: ${it.source()?.customerFullName}"
    println(msg)
}

// Full Name: Eddie Underwood
// Full Name: Mary Bailey
// Full Name: Gwen Butler
// and so on...
```

## Aggregations

Not all queries require full-text search. Elasticsearch also supports aggregations, which are a way of grouping and extracting statistics from data. The following example shows how to create a terms aggregation, which is a way of grouping data by a field, and then counting the number of documents in each group. In this query I search the `kibana_sample_data_ecommerce` index, and group the data by the `customer_full_name` field, and then count the number of documents in each group.

```kotlin
val request =
    SearchRequest.of { s ->
        s.index("kibana_sample_data_ecommerce")
        .size(0)
        .query { q ->
            q.matchAll { m -> m.queryName("matchAll") }
        }
        .aggregations("customers") { a ->
            a.terms { term ->
                term.field("customer_full_name.keyword").size(5)
            }
        }
    }

val response = esClient.search(request, Void::class.java)
response.aggregations().getValue("customers").sterms().buckets().array().forEach { bucket ->
    println(bucket)
}
```

## Sub-Aggregations

Adding sub aggregations is also simple enough. In this example I group the data by the `customer_full_name` field, and then group the data by the `category` field. I then count the number of documents in each product category.

```kotlin
val request =
    SearchRequest.of { s ->
        s.index("kibana_sample_data_ecommerce")
        .size(0)
        .query { q ->
            q.matchAll { m -> m.queryName("matchAll") }
        }
        .aggregations("customers") { a ->
            a.terms { term ->
                term.field("customer_full_name.keyword").size(5)
            }.aggregations("category") { sa ->
                sa.terms { terms2 ->
                    terms2.field("category.keyword").size(100)
                }
            }
        }
    }

val response = esClient.search(request, Order::class.java)
response.aggregations().getValue("customers").sterms().buckets().array().forEach { bucket ->
    val name = bucket.key().stringValue()
    println(name)
    bucket.aggregations().getValue("category").sterms().buckets().array().forEach {
        println("\t$it")
    }
}

// Elyssa Hansen
// 	StringTermsBucket: {"doc_count":5,"key":"Women's Clothing"}
// 	StringTermsBucket: {"doc_count":4,"key":"Women's Accessories"}
// 	StringTermsBucket: {"doc_count":4,"key":"Women's Shoes"}
// Stephanie Hodges
// 	StringTermsBucket: {"doc_count":5,"key":"Women's Shoes"}
// 	StringTermsBucket: {"doc_count":4,"key":"Women's Clothing"}
// 	StringTermsBucket: {"doc_count":2,"key":"Women's Accessories"}
// Elyssa Lewis
// 	StringTermsBucket: {"doc_count":5,"key":"Women's Clothing"}
// 	StringTermsBucket: {"doc_count":4,"key":"Women's Accessories"}
// 	StringTermsBucket: {"doc_count":2,"key":"Women's Shoes"}
// Elyssa Reese
// 	StringTermsBucket: {"doc_count":4,"key":"Women's Clothing"}
// 	StringTermsBucket: {"doc_count":4,"key":"Women's Shoes"}
// 	StringTermsBucket: {"doc_count":2,"key":"Women's Accessories"}
// Elyssa Summers
// 	StringTermsBucket: {"doc_count":5,"key":"Women's Clothing"}
// 	StringTermsBucket: {"doc_count":5,"key":"Women's Shoes"}
// 	StringTermsBucket: {"doc_count":2,"key":"Women's Accessories"}
```

## Point-in-Time Search

Point-in-Time searches are ideal for use cases where you need to search a large index, and you want to be able to page through the results rather than load them all into memory. The following example shows how to open a point-in-time search, and then page through the results. It possible to do this by open a Point-in-Time request (in this instance I keep it open for a maximum of 5 minutes) and then start my search, limiting by 5 documents. I then page through the results by using the `searchAfter` parameter, which is the sort value of the last document in the previous page. I then close the point-in-time search if it hasn't already timed out.

```kotlin
// Open PiT
val openPitRequest = OpenPointInTimeRequest.of {
    it.index("kibana_sample_data_ecommerce").keepAlive(Time.of { t -> t.time("5m") })
}
val pitResponse = esClient.openPointInTime(openPitRequest)


// Search
var searchAfter: List<FieldValue>? = null
var searchMore = true

while (searchMore) {
    val searchRequest = SearchRequest.of { searchRequest ->
        searchRequest.size(5)
            .query { q -> q.matchAll { m -> m.queryName("matchAll") } }
            .pit { pit -> pit.id(pitResponse.id()) }
            .sort { so -> so.field { f -> f.field("order_date") } }
            .apply { searchAfter?.let { searchRequest.searchAfter(searchAfter) } }
    }

    val response = esClient.search(searchRequest, Order::class.java)
    if (response.hits().hits().isNotEmpty()) {
        searchAfter = response.hits().hits().last().sort()

        println(">>")
        response.hits().hits().forEach(::println)
    } else {
        searchAfter = null
        searchMore = false
    }
}

// Close PiT
val closePitRequest = ClosePointInTimeRequest.of { it.id(pitResponse.id()) }
esClient.closePointInTime(closePitRequest)

// >>
// Hit: {"_index":"kibana_sample_data_ecommerce","_id":"zarW8YsBPrmP91v7K9b-","_score":null,"matched_queries":["matchAll"],"_source":"Order(category=[Women's Clothing], currency=EUR, customerFirstName=Diane, customerFullName=Diane Estrada, customerGender=FEMALE, customerId=22, customerLastName=Estrada, customerPhone=, dayOfWeek=Saturday, dayOfWeekI=5, email=diane@estrada-family.zzz, manufacturer=[Tigress Enterprises, Gnomehouse], orderDate=2023-12-09T22:48:00+00:00, orderId=592043, sku=[ZO0071900719, ZO0334103341], products=[Product(id=sold_product_592043_19260, basePrice=32.99, discountPercentage=0, quantity=1, manufacturer=Tigress Enterprises, taxAmount=0, productId=19260, category=Women's Clothing, sku=ZO0071900719, taxlessPrice=32.99, unitDiscountAmount=0, minPrice=17.15, discountAmount=0, createdOn=2016-12-31T22:48:00+00:00, productName=Cardigan - grey, price=32.99, taxfulPrice=32.99, baseUnitPrice=32.99), Product(id=sold_product_592043_22499, basePrice=41.99, discountPercentage=0, quantity=1, manufacturer=Gnomehouse, taxAmount=0, productId=22499, category=Women's Clothing, sku=ZO0334103341, taxlessPrice=41.99, unitDiscountAmount=0, minPrice=21.01, discountAmount=0, createdOn=2016-12-31T22:48:00+00:00, productName=Summer dress - black, price=41.99, taxfulPrice=41.99, baseUnitPrice=41.99)])","sort":[1702162080000,1521]}
// and so on...
// >>
// Hit: {"_index":"kibana_sample_data_ecommerce","_id":"5qrW8YsBPrmP91v7LNg7","_score":null,"matched_queries":["matchAll"],"_source":"Order(category=[Men's Shoes, Men's Clothing], currency=EUR, customerFirstName=Marwan, customerFullName=Marwan Tran, customerGender=MALE, customerId=51, customerLastName=Tran, customerPhone=, dayOfWeek=Saturday, dayOfWeekI=5, email=marwan@tran-family.zzz, manufacturer=[Angeldale, Low Tide Media], orderDate=2023-12-09T23:13:55+00:00, orderId=592079, sku=[ZO0685006850, ZO0440504405], products=[Product(id=sold_product_592079_21741, basePrice=74.99, discountPercentage=0, quantity=1, manufacturer=Angeldale, taxAmount=0, productId=21741, category=Men's Shoes, sku=ZO0685006850, taxlessPrice=74.99, unitDiscountAmount=0, minPrice=38.24, discountAmount=0, createdOn=2016-12-31T23:13:55+00:00, productName=High-top trainers - sand, price=74.99, taxfulPrice=74.99, baseUnitPrice=74.99), Product(id=sold_product_592079_18088, basePrice=13.99, discountPercentage=0, quantity=1, manufacturer=Low Tide Media, taxAmount=0, productId=18088, category=Men's Clothing, sku=ZO0440504405, taxlessPrice=13.99, unitDiscountAmount=0, minPrice=7.55, discountAmount=0, createdOn=2016-12-31T23:13:55+00:00, productName=Print T-shirt - mottled light blue, price=13.99, taxfulPrice=13.99, baseUnitPrice=13.99)])","sort":[1702163635000,2058]}
// and so on...
```

## Inserting Data

Inserting data with the client is also rather trivial. In this example I create a `Product` and `Order` object, and then index the `Order` object into Elasticsearch. The `Order` object contains a list of `Product` objects, which are also indexed into Elasticsearch. This is achieved using the `index` API.

```kotlin
val product =
    Product(
        "1234",
        basePrice = BigDecimal(10.99),
        baseUnitPrice = BigDecimal(1.0),
        category = "Men's Clothes",
        createdOn = LocalDateTime.now().toString(),
        discountAmount = BigDecimal(0),
        discountPercentage = BigDecimal(0),
        manufacturer = "abcd",
        minPrice = BigDecimal(1),
        price = BigDecimal(15),
        productId = 134123532,
        productName = "Product",
        quantity = 100,
        sku = "lkjasdf",
        taxAmount = BigDecimal(13),
        taxfulPrice = BigDecimal(13),
        taxlessPrice = BigDecimal(13),
        unitDiscountAmount = "123")

val order =
    Order(
        category = listOf("Men's Clothes"),
        currency = "GBP",
        customerFirstName = "Hans",
        customerFullName = "Hans Moleman",
        customerGender = "X",
        customerId = 1234,
        customerLastName = "Moleman",
        customerPhone = "077112211221122",
        dayOfWeek = "Wednesday",
        dayOfWeekI = 3,
        email = "hans@moleman.com",
        manufacturer = listOf("unknown"),
        orderDate = LocalDateTime.now().toString(),
        orderId = 1234,
        sku = listOf("123412314"),
        products = listOf(product))

val indexResponse =
    esClient.index { i ->
        i.index("kibana_sample_data_ecommerce").id(product.sku).document(order)
    }

println(indexResponse)

// IndexResponse: {"_id":"lkjasdf","_index":"kibana_sample_data_ecommerce","_primary_term":1,"result":"created","_seq_no":4675,"_shards":{"failed":0.0,"successful":1.0,"total":2.0},"_version":1}
```

## Document Retrieval

Retrieving a single document is also trivial if you know the id of the document ahead of time. In this example I retrieve the document that I just indexed.

```kotlin
val req = GetRequest.of { g ->
    g.index("kibana_sample_data_ecommerce")
            .id(product.sku)
}

val response = esClient.get(req, Order::class.java)
println(response)

// GetResponse: {"_index":"kibana_sample_data_ecommerce","found":true,"_id":"lkjasdf","_primary_term":1,"_seq_no":4675,"_source":"Order(category=[Men's Clothes], currency=GBP, customerFirstName=Hans, customerFullName=Hans Moleman, customerGender=X, customerId=1234, customerLastName=Moleman, customerPhone=077112211221122, dayOfWeek=Wednesday, dayOfWeekI=3, email=hans@moleman.com, manufacturer=[unknown], orderDate=2023-11-22T14:15:49.563054, orderId=1234, sku=[123412314], products=[Product(id=1234, basePrice=10.9900000000000002131628207280300557613372802734375, discountPercentage=0, quantity=100, manufacturer=abcd, taxAmount=13, productId=134123532, category=Men's Clothes, sku=lkjasdf, taxlessPrice=13, unitDiscountAmount=123, minPrice=1, discountAmount=0, createdOn=2023-11-22T14:15:49.560361, productName=Product, price=15, taxfulPrice=13, baseUnitPrice=1)])","_version":1}
```

## Async Searching

The following example shows how to create an asyncronous client, and then submit a search request. The search request is submitted using the `search` method, which returns a `CompletableFuture` instead of a `SearchHit`. The `CompletableFuture` can then be used to wait for the result, or to perform an action when the result is available. I use all the defaults of the syncronous client that was created at the start of this post.

```kotlin
object ElasticCloudClientFactory {
  private const val REFLECTION_CACHE_SIZE = 512

  fun create(): ElasticsearchAsyncClient {
    val restClient =
        RestClient.builder(HttpHost("localhost", 9200, "http"))
            .setDefaultHeaders(
                arrayOf(
                    BasicHeader(
                        "Authorization",
                        "ApiKey 🤐")))
            .build()

    val transport =
        RestClientTransport(
            restClient,
            JacksonJsonpMapper(
                jacksonObjectMapper()
                    .registerModule(
                        KotlinModule.Builder()
                            .withReflectionCacheSize(REFLECTION_CACHE_SIZE)
                            .configure(KotlinFeature.NullToEmptyCollection, false)
                            .configure(KotlinFeature.NullToEmptyMap, false)
                            .configure(KotlinFeature.NullIsSameAsDefault, false)
                            .configure(KotlinFeature.SingletonSupport, false)
                            .configure(KotlinFeature.StrictNullChecks, false)
                            .build(),
                    ),
            ),
        )

    return ElasticsearchAsyncClient(transport)
  }
}
```

In this example I wait for the result, with a timeout of 10 seconds.

```kotlin
val request =
    SearchRequest.of { s ->
        s.index("kibana_sample_data_ecommerce")
        .size(0)
        .query { q ->
            q.matchAll { m -> m.queryName("matchAll") }
        }
        .aggregations("customers") { a ->
            a.terms { term ->
                term.field("customer_full_name.keyword").size(5)
            }.aggregations("category") { sa ->
                sa.terms { terms2 ->
                    terms2.field("category.keyword").size(100)
                }
            }
        }
    }

val response: CompletableFuture<SearchResponse<Order>> = esClient.search(request, Order::class.java)
val res = response.get(10, TimeUnit.SECONDS)

// SearchResponse: {"took":1,"timed_out":false,"_shards":{"failed":0.0,"successful":1.0,"total":1.0,"skipped":0.0},"hits":{"total":{"relation":"eq","value":4675},"hits":[],"max_score":null},"aggregations":{"sterms#customers":{"buckets":[{"sterms#category":{"buckets":[{"doc_count":5,"key":"Women's Clothing"},{"doc_count":4,"key":"Women's Accessories"},{"doc_count":4,"key":"Women's Shoes"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":7,"key":"Elyssa Hansen"},{"sterms#category":{"buckets":[{"doc_count":5,"key":"Women's Shoes"},{"doc_count":4,"key":"Women's Clothing"},{"doc_count":2,"key":"Women's Accessories"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":7,"key":"Stephanie Hodges"},{"sterms#category":{"buckets":[{"doc_count":5,"key":"Women's Clothing"},{"doc_count":4,"key":"Women's Accessories"},{"doc_count":2,"key":"Women's Shoes"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":6,"key":"Elyssa Lewis"},{"sterms#category":{"buckets":[{"doc_count":4,"key":"Women's Clothing"},{"doc_count":4,"key":"Women's Shoes"},{"doc_count":2,"key":"Women's Accessories"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":6,"key":"Elyssa Reese"},{"sterms#category":{"buckets":[{"doc_count":5,"key":"Women's Clothing"},{"doc_count":5,"key":"Women's Shoes"},{"doc_count":2,"key":"Women's Accessories"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":6,"key":"Elyssa Summers"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":4643}}}
```

And in this example I perform an action when the result is available using a function that doesn't do much but output to Stdout. 

```kotlin
val response: CompletableFuture<SearchResponse<Order>> = esClient.search(request, Order::class.java)
response.thenApply(::printResults)

// SearchResponse: {"took":1,"timed_out":false,"_shards":{"failed":0.0,"successful":1.0,"total":1.0,"skipped":0.0},"hits":{"total":{"relation":"eq","value":4675},"hits":[],"max_score":null},"aggregations":{"sterms#customers":{"buckets":[{"sterms#category":{"buckets":[{"doc_count":5,"key":"Women's Clothing"},{"doc_count":4,"key":"Women's Accessories"},{"doc_count":4,"key":"Women's Shoes"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":7,"key":"Elyssa Hansen"},{"sterms#category":{"buckets":[{"doc_count":5,"key":"Women's Shoes"},{"doc_count":4,"key":"Women's Clothing"},{"doc_count":2,"key":"Women's Accessories"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":7,"key":"Stephanie Hodges"},{"sterms#category":{"buckets":[{"doc_count":5,"key":"Women's Clothing"},{"doc_count":4,"key":"Women's Accessories"},{"doc_count":2,"key":"Women's Shoes"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":6,"key":"Elyssa Lewis"},{"sterms#category":{"buckets":[{"doc_count":4,"key":"Women's Clothing"},{"doc_count":4,"key":"Women's Shoes"},{"doc_count":2,"key":"Women's Accessories"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":6,"key":"Elyssa Reese"},{"sterms#category":{"buckets":[{"doc_count":5,"key":"Women's Clothing"},{"doc_count":5,"key":"Women's Shoes"},{"doc_count":2,"key":"Women's Accessories"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":0},"doc_count":6,"key":"Elyssa Summers"}],"doc_count_error_upper_bound":0,"sum_other_doc_count":4643}}}

```