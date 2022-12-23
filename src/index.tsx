import React, { FunctionComponent } from "react";
import type { WebViewMessageEvent, WebViewProps } from "react-native-webview";
import { WebView } from "react-native-webview";


export type Region = "EU" | "US" | "CA";
export type SdkParameters = {};

export type SupportedLanguages =
  | "en_US"
  | "en"
  | "de_DE"
  | "de"
  | "es_ES"
  | "es"
  | "fr_FR"
  | "fr"
  | "it_IT"
  | "it"
  | "pt_PT"
  | "pt"
  | "nl_NL"
  | "nl";

export type SdkOptions = {
  token: string,
  language?: SupportedLanguages,
  smsNumberCountryCode?: string,
  userDetails?: {
    smsNumber?: string,
  },
  steps?: Array<any>,
  autoFocusOnInitialScreenTitle?: boolean,
  crossDeviceClientIntroProductName?: string,
  crossDeviceClientIntroProductLogoSrc?: string,
  workflowRunId?: string,
};

export type DocumentResponse = {
  id: string,
  side: string,
  type: DocumentTypes,
  variant: RequestedVariant,
}

export type DocumentVideoResponse = {
  id: string,
  media_uuids: string[],
  variant: 'video',
}

export type FaceResponse = {
  id: string,
  variant: RequestedVariant,
}

export type ActiveVideoResponse = {
  id: string
}

export type SdkResponse = {
  document_front?: DocumentResponse,
  document_back?: DocumentResponse,
  document_video?: DocumentVideoResponse,
  face?: FaceResponse,
  data?: any,
  poa?: DocumentResponse,
  active_video?: ActiveVideoResponse,
}

export type OnfidoWebViewProps = {
  region: Region,
  version?: string,
  webviewPros?: WebViewProps,
  parameters: SdkParameters,
  onComplete?: (data: SdkResponse) => void,
  onError?: (data: SdkError) => void,
  onComplete?: (data: SdkResponse) => void
};

export type SdkError = {
  type: 'exception' | 'expired_token',
  message: string
}


const defaultWebViewProps: WebViewProps = {
  allowsInlineMediaPlayback: true,
};


export const OnfidoWebView: FunctionComponent<OnfidoWebViewProps> = props => {
  const ref = React.createRef();

  const uri = `https://sdk.${props.region.toLowerCase()}.onfido.app/frame`;

  const bootstrapSdk = () => {

    const {version, parameters} = props


    const script = `
      const bootstrap = (async () => {

        const parameter = ${JSON.stringify(parameters)};
        const version = ${version} || (window.sdk || {}).version;

        async function loadScript(src) {
          return new Promise((resolve, rejects) => {
            const script = document.createElement("script");
            script.src = src;

            script.onload = () => {
              resolve();
            };

            script.onerror = (e) => {
              rejects(e);
            };

            document.head.appendChild(script);

          });
        }

        function loadCss(href) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;

          document.head.appendChild(link);
        }

        const basePath = "https://assets.onfido.com/web-sdk-releases/" + version;
        loadCss(basePath + '/style.css');

        await loadScript(basePath + '/onfido.min.js');

        var boot = {
          ...parameter,
          containerEl: document.body,
          onComplete: (e) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ method: "onComplete", data: e }));
          },
          onError: (e) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ method: "onError", data: e }));
          },
          onUserExit: (e) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ method: "onUserExit", data: e }));
          },
        };

        console.log(boot);

        window.handle = Onfido.init(boot);

      });

      bootstrap()
        .then(() => {
          document.getElementById("spinner")?.remove();
        })
        .catch(e => {
          alert(e.stack)
        });
      
      true
    `;

    return script;
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log(event, data)
    props[data.method] && props[data.method](data.data);
  };

  let sdk = undefined;
  let loaded = false;

  return <WebView
    {...props.webviewPros}
    {...defaultWebViewProps}
    source={{ uri: uri }}
    ref={ref}
    onMessage={handleMessage}
    injectedJavaScriptForMainFrameOnly={true}
    injectedJavaScript={bootstrapSdk()}

  />;

};

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}