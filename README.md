# React Hooks
A small collection of simple React Hooks you're probably rewriting on a regular basis

1. [useMount](#usemount) - Execute a callback on first mount
2. [useUnmount](#useunmount) - Execute a callback on unmount
3. [useLoadingState](#useloadingstate) - Provides a controller for getting/setting loading, error, and success states for a UI interaction
4. [useFormState](#useformstate) - Provides a controller with access to form data, loading, error, and success states for a form submission
5. [useTimeout](#usetimeout) - Execute deferred callbacks that'll automatically clean themselves up when the hook unmounts
6. [useAnimationFrame](#useanimationframe) - Execute callbacks in `requestAnimationFrame` that'll automatically stop/cancel if the hook unmounts
7. [useController](#useController) - Maintains a stable reference to an object instance (created by a component) between renders
8. [useDebouncer](#useDebouncer) - Given a callback and a wait period, returns a debounced implementation of that callback. The scheduled callback will automatically cancel if the component unmounts.
9. [useThrottler](#useThrottler) - Given a callback and a wait period, returns a throttled implementation of that callback
10. [useLocale](#useLocale) - Returns the user's specified locale and rerenders whenever it changes
11. [useFocusedKeyListener](#useFocusedKeyListener) - A hook that will respond to keydown events if target element comes into focus 
12. [useWindowSize](#useWindowSize) - A hook that returns the current dimensions of the window object. When the window is undefined (in SSR environments), the height and width dimensions are set to zero
13. [useNodeDimensions](#useNodeDimensions) - A hook that returns a `ref` and a `dimensions` object containing `width` and `height` values. When the provided `ref` is attached to a `DOM` element, the hook will rerender a new `dimensions` object each time the element's `width` or `height` change.

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
  // state = { loading: boolean, error: boolean | string, success: boolean }

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

  const classes = useClassNames("my-button", { error: !!error, success, loading });

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
import { FormEvent, ChangeEvent, useEffect, forwardRef, ForwardedRef } from "react";
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

export const MyForm = forwardRef(function(_: Propless, ref: ForwardedRef<FormCtrl>) {
  const controller = useController(new FormCtrl());

  // To expose your controller to other components:
  useImperativeHandle(
    ref,
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
});
```

### useDebouncer
Given a callback and a wait period, returns a debounced implementation of that callback. The scheduled callback will automatically cancel if the component unmounts.
```tsx
const AutoComplete = () => {
  const input = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = useCallback(() => {
    fetch(`/api?search=${input.current.value}`)
      .then(res => res.json())
      .then(setSuggestions)
      .catch(() => {});
  }, []);

  const fetchMore = useDebouncer(fetchData, 200);

  return (
    <div>
      <input 
        id='search'
        ref={input}
        type="search" 
        placeholder="Search" 
        onChange={fetchMore}
        list='searchSuggestions' />
      <datalist list='searchSuggestions'>
        {
          suggestions.map(suggestion => {
            return (
              <option key={suggestion} value={suggestion} />
            );
          })
        }
      </datalist>
    </div>
  );
}
```

### useThrottler
Given a callback and a wait period, returns a throttled implementation of that callback
```tsx
const ThreeDButton = () => {
  const button = useRef<HTMLButtonElement>(null);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [shadow, setShadow] = useState(`0px 0px 0px rgba(0,0,0,0)`);

  const onMouseMove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const { top, left, width, height } = button.getBoundingClientRect();
    const X = e.clientX - left;
    const Y = e.clientY - top;
    const midX = width / 2;
    const midY = height / 2;
    setRotationX((Y - midY) * 0.05);
    setRotationY((X - midX) * -0.05);
    setShadow(`${(X - midX) * 0.15}px ${(Y - midY) * 0.15}px ${Math.max(X, Y) / 5}px rgba(0,0,0,0.2)`);
  }, [])

  const animate = useThrottler(onMouseMove, 100);

  return (
    <button ref={button} onMouseMove={animate}>
      3D Button!
    </button>
  );
}
```

### useLocale
Returns the user's specified locale and rerenders whenever it changes
```tsx
export const useLocalizedNumber = (value: number) => {
  const locale = useLocale();
  return useMemo(() => {
    return new Intl.NumberFormat(locale, {}).format(value);
  }, [value, locale]);
}
```

### useFocusedKeyListener
A hook that will respond to keydown events if target element comes into focus 
```tsx
export const MyAllyComponent = () => {
  const node = useRef<HTMLDivElement>(null);
  const onEnter = useCallback(() => {
    // Take some action when this component is focused
    // and the user presses the enter key
  }, []);
  const onDelete = useCallback(() => {
    // Take some action when this component is focused
    // and the user presses the delete key
  }, []);
  useFocusedKeyListener(onEnter, "Enter");
  useFocusedKeyListener(onEnter, "Delete");
  return (
    <div ref={node} role="button">
      {/* ...Markup */}
    </div>
  );  
}
```

### useNodeDimensions
 A hook that returns a `ref` and a `dimensions` object containing `width` and `height` values. When the provided `ref` is attached to a `DOM` element, the hook will rerender a new `dimensions` object each time the element's `width` or `height` change.
 ```tsx

 export const MyResizingComponent = ({ children }) => {
  const [ref, dimensions] = useNodeDimensions();

  useEffect(() => {
    if(dimensions) {
      console.log('This component resized!', dimensions);
    }
  }, [dimensions]);

  return (
    <div ref={ref}>{children}</div>
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