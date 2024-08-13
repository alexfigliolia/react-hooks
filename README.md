# React Hooks
A small collection of simple React Hooks you're probably rewriting on a regular basis

1. [useMount](#usemount) - Execute a callback on first mount
2. [useUnmount](#useunmount) - Execute a callback on unmount
3. [useLoadingState](#useloadingstate) - Provides a controller for getting/setting loading, error, and success states for a UI interaction
4. [useFormState](#useformstate) - Provides a controller with access to form data, loading, error, and success states for a form submission
5. [useTimeout](#usetimeout) - Execute deferred callbacks that'll automatically clean themselves up when the hook unmounts
6. [useAnimationFrame](#useanimationframe) - Execute callbacks in `requestAnimationFrame` that'll automatically stop/cancel if the hook unmounts
7. [useController](#useController) - Maintains a stable reference to an object instance (created by a component) between renders

## Installation
```bash
npm i @figliolia/react-hooks
# or
yarn add @figliolia/react-hooks
```

## Basic Usage
### useMount
Execute a callback on the first mount of a hook or component
```tsx
import { useMount } from "@figliolia/react-hooks";

export const MyComponent = () => {

  useMount(() => {
    // Executes on first mount!
  });

  return (
    // JSX
  );
}
```

### useUnmount
Execute a callback when a hook or component unmounts - note - this callback will ***not*** run when props change
```tsx
import { useUnmount } from "@figliolia/react-hooks";

export const MyComponent = () => {

  useUnmount(() => {
    // Executes on unmount!
  });

  return (
    // JSX
  );
}
```

### useLoadingState
Provides a controller for getting/setting loading, error, and success states for a UI interaction
```tsx
import { useLoadingState } from "@figliolia/react-hooks";
import { useClassNames } from "@figliolia/classnames";
import { useCallback } from "react";

export const MyComponent = () => {
  const { setState, resetState, ...state } = useLoadingState();

  const onClick = useCallback(() => {
    setState("loading", true);
    void fetch("/api/some-data")
    .then(data => data.json())
    .then(data => {
      setState("success", true);
    }).catch(() => {
      setState("error", true);
    });
  }, [setState, reset]);

  const classes = useClassNames("my-button", state);

  return (
    <button 
      className={classes}
      onClick={onClick}>Click Me!</button>
  );
}
```

### useFormState
Provides a controller with access to form data, loading, error, and success states for a form submission
```tsx
import { useFormState } from "@figliolia/react-hooks";
import { useClassNames } from "@figliolia/classnames";

export const MyForm = () => {
  const { 
    error,
    loading,
    success,
    onSubmit, // form submit handler
  } = useFormState((data, setState) => {
    // data = FormData({ name, email, password })
    setState("loading", true);
    void fetch("/post-data", {
      body: data,
      method: "POST",
    }).then(() => {
      setState("success", true);
    }).catch(() => {
      setState("error", true);
    })
  });

  const classes = useClassNames("my-button", state);

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button className={classes}>Submit!</button>
    </form>
  );
}
```

### useTimeout 
Execute deferred callbacks that'll automatically clean themselves up when the hook unmounts
```tsx
import { useState, useCallback } from "react";
import { useTimeout } from "@figliolia/react-hooks";

export const CounterButton = () => {
  const [count, setCount] = useState(0);
  const timeout = useTimeout();

  const onClick = useCallback(() => {
    timeout.execute(() => {
      setCount(count => count + 1);
    }, 1000);
    // If CounterButton unmounts, all pending calls to 
    // timeout.execute() are cancelled
  }, []);

  return (
    <button onClick={onClick}>{count}</button>
  );
}
```

### useAnimationFrame 
Execute callbacks in `requestAnimationFrame` that'll automatically stop/cancel if the hook unmounts
```tsx
import { useAnimationFrame } from "@figliolia/react-hooks";

export const ProgressIndicator = () => {
  const [count, setCount] = useState(0);
  const animator = useAnimationFrame();

  const onClick = useCallback(() => {
    animator.execute(() => {
      setProgress(progress => progress + 1);
    });
    // If ProgressIndicator unmounts, all pending calls to 
    // animator.execute() are cancelled
  }, []);

  return (
    <>
      <button onClick={onClick}>Progress: {progress}%</button>
      <div 
        className="progress-bar"
        style={{ width: `${progress}%` }}>
    </>
  );
}
```


### useController 
Maintains a stable reference to an object instance (created by a component) between renders
```tsx
import { FormEvent, ChangeEvent, useEffect } from "react";
import { useController } from "@figliolia/react-hooks";

class FormCtrl {
  public formData: Record<string, string> = {};

  public initialize() {
    // some initialization logic
  }

  public destroy() {
    // some tear down logic
  }
  
  public onChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.formData[e.target.name] = e.target.value;
  }

  public onSubmit = (e: FormEvent<HTMLFormElement>) => {
    for(const key in this.formData) {
      // validate form data
    }
    void fetch("/post-data", { 
      method: "POST", 
      body: JSON.stringify(this.formData)
    }).then(() => {
      this.formData = {};
    }).catch(() => {})
  }
}

export const MyForm = () => {
  const controller = useController(new FormCtrl());

  // To expose your controller to other components:
  useImperativeHandle(
    /* forwardRef */, 
    () => controller, 
    [controller]
  )

  // controller is stable and always defined between renders
  // so this useEffect only fires on mount/unmount
  useEffect(() => {
    controller.initialize();
    return () => {
      controller.destroy()
    }
  }, [controller])

  // all public methods are exposed to use in component
  // logic:
  return (
    <form>
      <input 
        type="text" 
        name="name" 
        onChange={controller.onChange} />
      <input 
        type="email" 
        name="email" 
        onChange={controller.onChange} />
      <input 
        type="password" 
        name="password" 
        onChange={controller.onChange} />
      <button 
        type="button"
        onClick={controller.onSubmit}>Submit!</button>
    </form>
  );
}
```

## Motivation
Since migrating to the hooks API at React v16, certain pieces of application functionality became more combersome or repetitive to implement. Such as:
1. Using and cleaning up timeouts/intervals to ensure no memory leaks
2. Ensuring a callback runs only on mount/unmount (while remaining up-to-date with most the recent props)
3. Adding micro-interactions to forms
4. Creating stable references to class-instances without needing to check if a `ref's` current value is `null`
5. Ensuring component-logic can be extracted into controllers as well as hooks

The hooks found in the library are the ones I find myself reaching for day-to-day, regardless of the product I'm working on. I hope they save you some time too!