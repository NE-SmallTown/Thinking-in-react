# 源码结构

# 整体计划

# 框架总览

## 整体思路

## 数据结构

# 生命周期

Commit 阶段会改变 DOM. 这些操作通常非常快，Reconcile 阶段会调用 render 方法，找出需要被渲染的东西，调用下一个 render 方法等等。[Twitter](https://twitter.com/dan_abramov/status/970683705768513536 )

commit 阶段的具体行为甚至可以与第三方交互：https://gist.github.com/NE-SmallTown/0a80d0630c9f35e5d448e37f3d076267

## Render 阶段

## Commit 阶段

# 执行过程

## ReactDOM.render(element, domContainer, callback)

## Renderer

### DOMRenderer

## Reconciler

### ReactFiberReconciler

## Scheduler

## ReactFiberScheduler

## Sync VS Async

### Demo