/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;
        private host: IVisualHost;
        private selectionManager: ISelectionManager;
        private button_120: HTMLElement;
        private button_121: HTMLElement;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.updateCount = 0;
            this.host= options.host;
            this.selectionManager = options.host.createSelectionManager();
            if (typeof document !== "undefined") {
                const new_div: HTMLElement = document.createElement("div");

                this.button_120 = document.createElement("button");
                this.textNode = document.createTextNode("120");
                this.button_120.appendChild(this.textNode);
                new_div.appendChild(this.button_120);

                const br = document.createElement("br");
                new_div.appendChild(br);

                this.button_121 = document.createElement("button");
                this.textNode = document.createTextNode("121");
                this.button_121.appendChild(this.textNode);
                new_div.appendChild(this.button_121);
                this.target.appendChild(new_div);
            }
        }

        public getCategoryColumn(identity) {
            const categoryColumn: DataViewCategoryColumn = {
              source: {
                displayName: null,
                queryName: identity.key,
              },
              values: null,
              identity: [identity],
            };
            return categoryColumn;
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            console.log('Visual update', options);
            let [dataView] = options.dataViews //options: VisualUpdateOptions
            let {matrix} = dataView;
            let dataValues = matrix.rows.root.children;
            let selectionids = [];
            for(let dataValue of dataValues) {
                let parentId = this.host.createSelectionIdBuilder()
                .withCategory(this.getCategoryColumn(dataValue.identity), 0)
                .createSelectionId();
                selectionids.push(parentId);
                if(dataValue.children) {
                    for(let dataChild of dataValue.children) {
                        const selectionBuilder = this.host.createSelectionIdBuilder();
                            selectionBuilder
                            .withCategory(this.getCategoryColumn(dataValue.identity), 0);
                        let selectionId = selectionBuilder
                        .withCategory(this.getCategoryColumn(dataChild.identity), 0)
                        .createSelectionId();
                        selectionids.push(selectionId)
                    }
                }
            }
            this.button_120.onclick = () => {
                let filteredSelections = selectionids.slice(0, 120)
                console.log(filteredSelections.length, selectionids.length)
                this.selectionManager.select(filteredSelections, false);
                return true;
            };
            this.button_121.onclick = () => {
                let filteredSelections = selectionids.slice(0, 121)
                console.log(filteredSelections.length, selectionids.length)
                this.selectionManager.select(filteredSelections, false);
                return true;
            };
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}