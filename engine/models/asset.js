define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");
    var assetLoadingCapabilities = require("burst/engine/capabilities/asset_loading_capabilities");

    var Asset = modelCapabilities({});

    Asset.rootPath = "";
    Asset.noCache = false;

    Asset.createOrFind = function(path) {
        var asset = Asset.find("path", path);
        if (asset === null) {
            asset = Asset.create(path);
        }

        return asset;
    };

    Asset.on("instance created", function(asset, path) {
        assetLoadingCapabilities(asset);
        asset.rootPath = Asset.rootPath;
        asset.noCache = Asset.noCache;
        asset.path = path;
        asset.tag("toLoad");
    });

    Asset.on("add manifest", function(manifest, tagName) {
        manifest.forEach(function(assetPath) {
            var asset = Asset.createOrFind(assetPath);
            if (typeof tagName !== "undefined") {
                asset.tag(tagName);
            }
        });
    });

    Asset.on("load by tag", function(tagName) {
        loadNextAssetFromCollection(tagName);
    });

    function loadNextAssetFromCollection(tagName) {
        if (Asset.toLoad[tagName].length > 0) {
            var asset = Asset.toLoad[tagName][0];
            asset.on("loaded", function() {
                loadNextAssetFromCollection(tagName);
            });
            asset.emit("load");
        } else {
            Asset.emit(tagName + " loaded");
        }
    }

    return Asset;

});