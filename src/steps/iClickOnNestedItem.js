module.exports = {
    docs: {
        description: "Performs a click on a control of a certain type nested inside a control with a known id",
        synopsis: "I click on the [<position>] <controlType> control '<deeply|directly>' nested inside <id> [with <property> '<text>'] [in <viewName> view]",
        examples: [
            "I click on the control directly nested inside grpButtons",
            "I click on the first control deeply nested inside grpButtons with text containing 'hi'",
            "I click on the sap.m.Button control deeply nested inside grpButtons",
            "I click on the 3rd sap.m.Button control deeply nested inside grpButtons with text 'Oranges'",
            "I click on the first sap.m.GenericTile control directly nested inside grpButtons",
            "I click on the 21st sap.m.Button control deeply nested inside grpButtons with text 'Apples' in Main view"
        ]
    },
    icon: "cursor-arrow",
    regexp: new RegExp([
        "^I click on (the( first| last| \\d+?st| \\d+?rd| \\d+?th| \\d+?nd)?( ([a-zA-Z]+[.])+[a-zA-Z]+)? control"
        , "\\s(deeply|directly) nested inside ([a-zA-Z0-9]+)"
        , "\\s?(with\\s([^\\s]+)\\s(containing\\s|starting\\swith\\s|ending\\swith\\s)?'(.+?)')?"    // [with <property> '<string>']
        , "(\\sin (.+?) view)?)"
        , "$"
    ].join("")),
    action: function (
        sDescriptiveMatch, // e.g., "the 23rd sap.m.Text ... in Main View"
        sMaybePosition,    // e.g., " 23rd"
        sControlType,      // e.g., " sap.m.Text"
        sControlPrefix,    // e.g., "sap.m."
        sDeeplyOrDirectly, // e.g., "deeply|directly"
        sControlId,        // e.g., "btnExecute"
        sWithProperty,     // e.g., "with text containing 'hello'"
        sPropertyName,     // e.g., "text"
        sTypeOfCheck,      // e.g., "containing "
        sValue,            // e.g., "hello"
        sViewPart,         // e.g., " in Main view"
        sViewName          // e.g., "Main"
    ) {

        var that = this;
        
        var oWaitForOptions = {
            id: sControlId,
            success: function (oControl) {
                var oSearchConstraints = {
                    itemIndex: sMaybePosition
                        ? that.utils.positionTextToIndex(sMaybePosition.replace(" ", ""))
                        : 0
                };

                if (sControlType) {
                    oSearchConstraints.controlType = sControlType.replace(" ", "");
                }

                if (sWithProperty) {
                    oSearchConstraints.property = sPropertyName;
                    oSearchConstraints.propertyOperand = (sTypeOfCheck || "equal to").replace(/\s+$/g, "");
                    oSearchConstraints.propertyValue = sValue;
                }

                var bDeepSearch = (sDeeplyOrDirectly === "deeply");

                var oSearch = that.utils.findNestedAggregationItem(
                    oControl, oSearchConstraints, bDeepSearch, []
                );

                that.Opa5.assert.ok(!!oSearch.found, sDescriptiveMatch + " found");

                oSearch.found.$().trigger("tap");
            }
        };

        if (sViewPart) {
            oWaitForOptions.viewName = sViewName;
        }

        this.opa.waitFor(oWaitForOptions);
    }
};