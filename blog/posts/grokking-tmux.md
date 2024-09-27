---
title: 'Grokking tmux'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2024-Sep-27'
show_post_footer: true
excerpt: >
  Grokking tmux
---

`tmux` is a handy terminal multiplexer that allows you to manage multiple terminal sessions within a single window, making it a useful for tasks such as running multiple long-lived processes simultaneously, often on remote machines. It can also be used multiple development tasks easily. If you are a macOS using (like me) you can set up with the following terminal commands.

```bash
$ brew install tmux
$ tmux -V
$ man tmux
$ alias t=tmux # if you are in the 1 char command club
```

Then, opening `tmux` is as easy as running the command

```bash
$ tmux
```

Then, view the available command list with the sequence

```emacs
C-b ?
```

## Splitting panes

To split panes for easier viewing, within the current pane run the following to;

**Horizonal split**

```emacs
C-b "
```

**Vertically split**

```emacs
C-b %
```

## List sessions

To list the various active sessions run

```bash
$ tmux ls
```

## Creating Windows

Creating new `tmux` windows can be done like so

```emacs
C-b c
```

## Exiting session

Exiting a `tmux` session is as easy as

```emacs
C-b d
```

or 

```emacs
exit
```

## Attaching

To attach to a `tmux` session, run

```bash
$ tmux attach -t 0
```

## New sessions

Creating new sessions can be done with

```bash
$ tmux new -s coolsession
```

## Renaming sessions

To rename a session, you can

```bash
$ tmux rename-session -t 1 2cool
```

## Full-screen mode

To go from pane, to full-screen mobe use

```emacs
C-b z
```

## Choose session from list

To access a session from a list view you can use

```emacs
C-b s
```

## Show a clock

If having a clock in a pane seems useful, you can

```emacs
C-b t
```

## tpm (Tmux Package Manager)

`tmux` has a package manager called tpm. It can be found at [https://github.com/tmux-plugins/tpm](https://github.com/tmux-plugins/tpm). 

```bash
$ git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

Once, cloned, vim into the conf file

```bash
$ vim ~/.tmux.conf
```

and list the plugins you want to install

```bash
# List of plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'

# keep at end of file
run '~/.tmux/plugins/tpm/tpm'
```

Then, refresh the current shell with

```bash
$ tmux source ~/.tmux.conf
```

## Installing the dracula theme

Installing themes is also possible. Installing the [dracula theme](https://draculatheme.com/tmux) can be done like so

```bash
set -g @plugin 'dracula/tmux'
```

```emacs
C-b I
```

## Start up with zsh

To start `tmux` on start-up of the shell you can use the following script.

```bash
if command -v tmux &> /dev/null && [ -n "$PS1" ] && [[ ! "$TERM" =~ screen ]] && [[ ! "$TERM" =~ tmux ]] && [ -z "$TMUX" ]; then
  exec tmux
fi
```

However, I do not believe this is recommended due to session nesting. It's probably a good idea not to do this.

## Awesome tmux

To conclude, further extending `tmux` and accessing reading materials can be found on this GitHub repository: [https://github.com/rothgar/awesome-tmux](https://github.com/rothgar/awesome-tmux)
