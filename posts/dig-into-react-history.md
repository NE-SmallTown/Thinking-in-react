Ref: https://blog.risingstack.com/the-history-of-react-js-on-a-timeline/

Note: This post is wrote by [Chinese](TODO) first and translated by me.

But I want to talk something different, not about what happened before, it's about
**why** the react team make these changes, and what could we get/learn from the process or src code.

## 2014

## 2015

## 2016

## 2017

copy from https://github.com/facebook/react/pull/11590/files?diff=unified#diff-d8411e2e9d23bdea09f0c01d01cbf389R233

```
// ----------------- The Life-Cycle of a Composite Component -----------------
// The render phase of a composite component is when we compute the next set
// of children. If there are no changes to props, state, or context, then we
// bail out and reuse the existing children. We may also bail out if
// shouldComponentUpdate returns false. Otherwise, we'll call the render
// method and reconcile the result against the existing set.
//
// The render phase is asynchronous, and may be interrupted or restarted.
// Methods in this phase should contain no side-effects. For example,
// componentWillMount may fire twice before the component actually mounts.
//
// Overview of the composite component render phase algorithm:
//   - Do we have new props or context since the last render?
//     -> componentWillReceiveProps(nextProps, nextContext).
//   - Process the update queue to compute the next state.
//   - Do we have new props, context, or state since the last render?
//     - If they are unchanged -> bailout. Stop working and don't re-render.
//     - If something did change, we may be able to bailout anyway:
//       - Is this a forced update (caused by this.forceUpdate())?
//         -> Can't bailout. Skip subsequent checks and continue rendering.
//       - Is shouldComponentUpdate defined?
//         -> shouldComponentUpdate(nextProps, nextState, nextContext)
//           - If it returns false -> bailout.
//       - Is this a PureComponent?
//         -> Shallow compare props and state.
//           - If they are the same -> bailout.
//   - Proceed with rendering. Are we mounting a new component, or updating
//     an existing one?
//     - Mount -> componentWillMount()
//     - Update -> componentWillUpdate(nextProps, nextState, nextContext)
//   - Call render method to compute next children.
//   - Reconcile next children against the previous set.
//
// componentDidMount, componentDidUpdate, and componentWillUnount are called
// during the commit phase, along with other side-effects like refs,
// callbacks, and host mutations (e.g. updating the DOM).
// ---------------------------------------------------------------------------
```

## 2018 and future

### Fiber




