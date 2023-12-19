import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const gcpConfig = new pulumi.Config("gcp");
const project = gcpConfig.require("project");

const gcpProvider = new gcp.Provider("gcp-provider", { project });

// Create a Kafka service.
const computeNetwork = new gcp.compute.Network("network");

const computeInstance = new gcp.compute.Instance("instance", {
    machineType: "f1-micro",
    zone: "us-central1-a",
    bootDisk: {
        initializeParams: { image: "debian-cloud/debian-9" },
    },
    networkInterfaces: [{
        network: computeNetwork.id,
        accessConfigs: [{}],
    }],
}, { provider: gcpProvider });
