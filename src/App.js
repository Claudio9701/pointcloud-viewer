import './App.css';
import { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { PLYWorkerLoader } from '@loaders.gl/ply';
import { load } from "@loaders.gl/core";
import { OrbitView, LinearInterpolator } from '@deck.gl/core';
import { renderLayers } from "./RenderLayers";
import styles from './App.module.css';

const INITIAL_VIEW_STATE = {
    target: [0, 0, 0],
    rotationX: 0,
    rotationOrbit: 0,
    minZoom: 0,
    maxZoom: 10,
    zoom: 1
};

const transitionInterpolator = new LinearInterpolator(['rotationOrbit']);

function App({onLoad}) {
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const [data, setData] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [model, setModel] = useState("10");
    
    
    const handleModelButton = (modelName) => setModel(modelName)


    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    // const isMobile = width <= 768;

    // useEffect(() => {
    //     if (!isLoaded) {
    //     return;
    //     }
    //     const rotateCamera = () => {
    //     setViewState(v => ({
    //         ...v,
    //         rotationOrbit: v.rotationOrbit + 120,
    //         transitionDuration: 2400,
    //         transitionInterpolator,
    //         onTransitionEnd: rotateCamera
    //     }));
    //     };
    //     rotateCamera();
    // }, [isLoaded]);

    useEffect(() => {
        const dataload = async () => {
          console.log(`./data/${model}.ply`)
          const res = await load(`./data/${model}.ply`, PLYWorkerLoader);

          const [mins, maxs] = res.header.boundingBox;
    
          setViewState({
            rotationOrbit: 200,
            target: [
              (mins[0] + maxs[0]) / 2,
              (mins[1] + maxs[1]) / 2,
              (mins[2] + maxs[2]) / 2
            ],
            zoom: Math.log2(window.innerWidth / (maxs[0] - mins[0]))
          });

          setData(res);
          setIsLoaded(true);
        };
        dataload();
      }, [model]);


    

    return <DeckGL
        views={new OrbitView({ fov: 50 })}
        viewState={viewState}
        onViewStateChange={v => setViewState(v.viewState)}
        layers={renderLayers({
            data: data
          })}
        parameters={{
           clearColor: [0.93, 0.86, 0.81, 1]
        }}
        controller={true}
        _pickable={false}
        //_typedArrayManagerProps = {isMobile ? {overAlloc: 1, poolSize: 0} : null}
        >
          <div className={styles.controls}>
          <button onClick={() => handleModelButton("Lego City - 2")}>Lego City - 2</button>
          <button onClick={() => handleModelButton("Lego City - 15")}>Lego City - 15</button>
          <button onClick={() => handleModelButton("1")}>Night Paris Car</button>
          <button onClick={() => handleModelButton("4")}>Monument Lion</button>
          <button onClick={() => handleModelButton("5")}>Dali Elepant</button>
          <button onClick={() => handleModelButton("6")}>Dali Woman</button>
          <button onClick={() => handleModelButton("7")}>Dali Rinho</button>
          <button onClick={() => handleModelButton("8")}>Dali Phone</button>
          <button onClick={() => handleModelButton("9")}>Weird</button>
          <button onClick={() => handleModelButton("10")}>Monument Man 1</button>
          <button onClick={() => handleModelButton("13")}>Monument Horse</button>
          </div>
    </DeckGL>
}

export default App;
