import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';
import { HttpAgent } from "@dfinity/agent";
import { createActor } from "../../declarations/slotm_backend";
import { slotm_backend } from "../../declarations/slotm_backend";

// Get the canister ID that matches your .env file
const canisterId = 'bkyz2-fmaaa-aaaaa-qaaaq-cai';

// Create an agent for local development
const agent = new HttpAgent({
  host: "http://127.0.0.1:4943",
  // Add the specific identity if needed for local development
});

// When in development, we'll fetch the root key
if (process.env.DFX_NETWORK !== "ic") {
  try {
    agent.fetchRootKey();
  } catch(err) {
    console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    console.error(err);
  }
}

// Create the actor with the specific canister ID
const actor = createActor(canisterId, {
  agent,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App actor={actor} />
  </React.StrictMode>
);