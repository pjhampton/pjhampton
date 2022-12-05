---
title: 'Grokking Sed'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2022-Apr-12'
show_post_footer: true
excerpt: >
  Grokking Sed
---

SED(1) - a handy *nix tool for stream editing which enables users to manipulate text within files. Many developers will have come across an example like this before, as seen on the sed man page:

```bash
sed -i '' -e 's/foo/bar/g' test.txt
```

This above line of code **replaces all occurances of 'foo' with 'bar' in a file without create a backup** of the original file. That is the extent most developers will ever use sed. I usually come across it as an agressive way of substituting values in a config file or script of some sort. sed is a little more interesting that just that though. This post looks at some a few additional ways to use sed for fun and profit*.

## Backing up

In the past, I have found when I use sed with regular expressions the outcome can sometimes be perplexing. Debugging regular expressions can be a tedious process that takes patience and skill.

```bash
sed -i.bak 's/foo/bar/g' test.txt
```

The above command will modify the file in place and make a copy of the file in place named **test.txt.bak**. 

## Addressing

Addressing is what makes sed so powerful. If you are just looking to execute your replacement on a specific line you can prefix with the line number.

```bash
sed -i '/l244/foo/bar/' file.txt
```

The above command will only do a subtitution on line 244 of the file.

```bash
sed -i '/hello/s/foo/bar' file.txt
```

You can also just replace text based on lines containing the word 'hello' and inverse this with the bang operator, where you replace foo with 'bar' on lines that **do not** contain the word 'hello'

```bash
sed -i '' -e '/hello/!s/foo/bar/' file.txt
```

## Scripts

Sed commands can grow out of control pretty fast. You can find yourself in a situation where you are pipeing sed commands into sed commands like the below when executing multiple substitutions:

```bash
sed -i 's/foo/bar/g' /etc/service/my.conf | sed -i 's/bar/baz/g'
```

A cleaner way to write the above would be chaining substitution arguments with the **-e** flag

```bash
sed -e 's/foo/bar/g' -e 's/bar/baz/g' -i.bak /etc/service/my.conf
```

However, if you have many of these commands (my personal rule of thumb is ~4) is to use a dedicated script. These commands can be grouped together and run as a file - example_script.sed

```perl
s/foo/bar/g
s/bar/baz/g
```

and run together with the **-f** flag:

```bash
sed -f example_script.sed /etc/service/my.conf
```

## Congratulations! 🦄

You just grokked sed!

\*No profit promised.
