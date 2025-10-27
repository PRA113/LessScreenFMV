import imgCanvas from "figma:asset/771d2f8552067324fd84ff9cfa4d9e83854cd862.png";

function App() {
  return <div className="absolute h-[598.667px] left-[819.49px] opacity-0 rounded-[48px] top-[0.67px] w-[1077.83px]" data-name="App" />;
}

function App1() {
  return <div className="absolute h-[598.667px] left-[0.67px] rounded-[48px] top-[0.67px] w-[798.667px]" data-name="App" />;
}

function App2() {
  return (
    <div className="absolute h-[596.667px] left-[1.67px] rounded-[47px] top-[1.67px] w-[796.667px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[47px]" />
    </div>
  );
}

function App3() {
  return (
    <div className="absolute h-[594.667px] left-[2.67px] rounded-[46px] top-[2.67px] w-[794.667px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[46px]" />
    </div>
  );
}

function Canvas() {
  return (
    <div className="h-[598.667px] relative shrink-0 w-full" data-name="Canvas">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgCanvas} />
    </div>
  );
}

function App4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[598.667px] items-start left-[0.67px] overflow-clip rounded-[48px] top-[0.67px] w-[798.667px]" data-name="App">
      <Canvas />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.08)] h-[600px] left-[268.67px] rounded-[48px] top-[165.67px] w-[800px]" data-name="Container">
      <div className="h-[600px] overflow-clip relative rounded-[inherit] w-[800px]">
        <App />
        <App1 />
        <App2 />
        <App3 />
        <App4 />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[0px_1px_0px_0px_inset_rgba(255,255,255,0.25),0px_-1px_0px_0px_inset_rgba(255,255,255,0.1)]" />
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(255,255,255,0.15)] border-solid inset-0 pointer-events-none rounded-[48px] shadow-[0px_206px_82px_0px_rgba(0,0,0,0.01),0px_116px_69px_0px_rgba(0,0,0,0.05),0px_51px_51px_0px_rgba(0,0,0,0.09),0px_13px_28px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

export default function InteractiveShaderCardCommunity() {
  return (
    <div className="bg-[#f9f9f9] relative size-full" data-name="Interactive Shader Card (Community)">
      <Container />
    </div>
  );
}