---
title: 'Concurrency in C'
published: 2025-07-04
draft: false
description: 'Testing how c handles concurrency with threads using asynchronus opperations and forking.'
tags: ['c']
---

With c being a low-level language, its built-in threading model often lacks simplicity when handling large-scale concurrent operations. Managing threads directly through pthread or OS-level APIs can introduce unnecessary overhead, synchronization complexity, and resource limits that make concurrency more frustrating than functional. This is especially true when building applications that require thousands of lightweight tasks or network connections running in parallel. 

Coroutines act as lightweight, cooperatively scheduled functions that can pause and resume without blocking the entire program. Instead of relying on heavy operating system threads, libmill creates user-space tasks that yield control back to a scheduler when waiting on I/O or timers.

example spawning a coroutine by calling go() on a function:

```c
package main

#include <libmill.h>

void worker(void) {
    msleep(now() + 100);
    printf("Hello from coroutine!\n");
}

int main(void) {
    go(worker());
    msleep(now() + 200);
}
```
Here, go(worker()) creates a coroutine that runs independently from the main thread. Unlike pthread_create, there’s no direct join or synchronization needed. Coroutines share the same address space but execute cooperatively, meaning each yields control explicitly (through msleep or channel operations). This helps keep the system lightweight.

Traditional C concurrency presents difficulties in safely sharing data between threads. Often needing a mutex to protect it's shared access memory state by "locking" that thread until a condition variable signals when data is ready. 

Libmill adds a safety overhead by employing channels to pass and manage these condition variables and functions in a simple structured way. example:

```c
package main

#include <libmill.h>

void producer(chan ch) {
    for(int i = 0; i < 5; i++) {
        send(ch, i);
    }
    chclose(ch);
}

void consumer(chan ch) {
    int val;
    while(recv(ch, &val))
        printf("Got %d\n", val);
}

int main(void) {
    chan ch = chmake(int, 0);
    go(producer(ch));
    go(consumer(ch));
    msleep(now() + 500);
}
```
Each coroutine communicates through a channel using send() and recv(), automatically handling synchronization and blocking. This makes concurrency easier to reason about since there’s no shared mutable state.

