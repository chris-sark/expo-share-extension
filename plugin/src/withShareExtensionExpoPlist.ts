import { ConfigPlugin, withExpoPlist } from "@expo/config-plugins";
import fs from "fs";
import path from "path";
import plist from "@expo/plist";
import { getShareExtensionName } from "./index";

// Define type for config object
interface ExpoConfig {
    modResults: Record<string, any>;
    modRequest: {
        platformProjectRoot: string;
    };
}


const withShareExtensionExpoPlist: ConfigPlugin = (config) => {
    return withExpoPlist(config, (config) => {
        // Get the final Expo.plist result
        const expoPlistData = config.modResults;
        const targetName = getShareExtensionName(config);

        // Determine the correct file path for Supporting/Expo.plist
        const targetPath = path.join(
            config.modRequest.platformProjectRoot,
            targetName,
            "Supporting",
            "Expo.plist"
        );

        // Ensure directory exists
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });

        // Write the plist file
        fs.writeFileSync(targetPath, plist.build(expoPlistData));

        return config;
    });
};

export default withShareExtensionExpoPlist
