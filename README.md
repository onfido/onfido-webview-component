# onfido-webview-component

A standalone component extending the existing  react-native-webview in order to integrating with latest version of [Onfido Web SDK](https://github.com/onfido/onfido-sdk-ui) on mobile apps. 

## Installation

```sh
npm install onfido-webview-component
```

## Usage

```js
import { OnfidoWebView, OnfidoWebViewProps } from 'onfido-webview-component';

// ... type usage

const parameters: OnfidoWebViewProps = {...}

//.... component usage

<OnfidoWebView region={'EU'}  
        parameters={parameters} 
        onComplete={(e) => {
         alert(JSON.stringify(e))
     }}/>

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
