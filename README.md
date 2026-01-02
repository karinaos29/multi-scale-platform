# 🧬 The Chronos Platform
### Multi-Scale Causal Inference via VGAE & Neural ODE

![Vercel Deployment](https://img.shields.io/badge/Vercel-Hosted-000000?style=for-the-badge&logo=vercel&logoColor=white)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Note:** This project was developed during an AI Hackathon. The codebase is a mix of human-written logic and AI-assisted generation, focused on rapid prototyping of complex biological modeling concepts.

---

## 🔗 Live Demo
**[View the Live Application on Vercel]**
https://multi-scale-platform.vercel.app
---

## Overview

**The Chronos Platform** is a proof-of-concept interface for uncovering causal regulatory networks that link genetic variation, multi-omics data, and dynamic cellular phenotypes.

### The Problem: Bridging Scale and Causality
Biological systems operate across vast spatial and temporal scales. Genetic variants (genomics) causally influence molecular species (transcriptomics, proteomics), which in turn dictate the dynamic behavior of cells (phenotype). Current multi-omics models often find correlations but struggle to capture the underlying temporal dynamics of the cellular state.

---

## Architecture

The system visualizes a two-stage, multi-modal AI architecture:

### Stage 1: Static Multi-Omics Integration (VGAE)
* **Model:** Variational Graph Autoencoder (VGAE).
* **Function:** Learns a compressed, low-dimensional latent representation ($z$) of the molecular state.
* **Key Mechanic:** The latent space is constrained to maximize mutual information with genomic data (SNPs/eQTLs), pushing $z$ to represent causal "bottleneck" factors driven by genetics.
* **Output:** A compact set of **Causal Latent Variables** representing the biologically relevant molecular state.

### Stage 2: Dynamic Phenotype Prediction (Neural ODE)
* **Model:** Neural Ordinary Differential Equation.
* **Function:** Defines the time derivative of the latent state, $\frac{dz}{dt} = f(z, \theta)$.
* **Key Mechanic:** Uses a small, interpretable neural network ($f$) to learn the dynamics of causal factors over time.
* **Output:** Fine-tuned causal network structure, inferring reaction rates and interaction strengths.

---

## 🛠️ Technical Implementation

This dashboard is built with the **React Ecosystem** to visualize the underlying scientific concepts.

* **Frontend Framework:** React (Vite)
* **Styling:** Tailwind CSS for rapid, responsive UI development.
* **Visualization:** Interactive graphs representing Biological Knowledge Graphs and latent variable weights.
* **Deployment:** Vercel.

### Key Features
* **Interactive Knowledge Graph:** Visualizing gene-protein interactions (e.g., TP53, MYC, MAPK1).
* **Latent Variable Sliders:** Dynamic visualization of Transcription Factor Activity, Metabolic Flux, and Stress Response.
* **Stage Switching:** Toggle between VGAE (Static) and Neural ODE (Dynamic) views.

---

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/multi-scale-platform.git](https://github.com/your-username/multi-scale-platform.git)
    cd multi-scale-platform
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open your browser to `http://localhost:5173`.

---

## Scientific Validation & QA

While this is a prototype, the theoretical framework relies on rigorous validation methods:
* **Mendelian Randomization (MR):** Used to validate causal links between $z$ factors and the final phenotype.
* **Perturbation Experiments:** Predicted network weights can be experimentally validated via CRISPR-knockouts of high-weight nodes.
