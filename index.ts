import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const gcpConfig = new pulumi.Config("gcp");
const project = gcpConfig.require("project");

const gcpProvider = new gcp.Provider("gcp-provider", {
    credentials: pulumi.secret("C:\\secrets\\mimustar-408611-a9656ed984fc.json"),
});

// Create a Kafka service.
const computeNetwork = new gcp.compute.Network("network");

const computeInstance = new gcp.compute.Instance("mimustar-instance", {
    machineType: "e2-micro",
    zone: "us-central1-c",
    bootDisk: {
        initializeParams: { image: "debian-10-buster-v20231212" },
    },
    networkInterfaces: [{
        network: computeNetwork.id,
        accessConfigs: [{}],
    }],

    metadataStartupScript: `#!/bin/bash
        # Nginxのインストールと起動
        sudo apt-get update

        git clone https://github.com/MimuraaEngitribe/CustomerWorkManagerBackend.git CustomerWorkManagerBackend

        cd CustomerWorkManagerBackend

        ./mvnw package spring-boot:repackage

        cd ..

        git clone https://github.com/MimuraaEngitribe/CustomerWorkManager.git CustomerWorkManager

        cd CustomerWorkManager

        npm run build

        cd ..

    `,
}, { provider: gcpProvider });

