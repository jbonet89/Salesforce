({
    
	getCaseHierarchiesQuick : function(component, helper, sObjId, sObjName) {
        
        var action = component.get("c.getHierarchiesQuickById"); //Get a pointer to apex method
        
        action.setParams({
            sObjId : sObjId,
            sObjName : sObjName
        });
        
        action.setCallback(this, function(response){
            var state = response.getState(); //Fetch the response state
            if(component.isValid() && state ==="SUCCESS"){
                var hierarchyString = response.getReturnValue();
                var hierarchy = JSON.parse(hierarchyString);
                var listAttributes = Object.keys(hierarchy[0].obj);
    			helper.formatHierarchy(helper, hierarchy[0], listAttributes);
                
                console.log('formatHierarchy - RESULT: '+JSON.stringify(hierarchy));
                
                component.set("v.gridExpandedRows", hierarchy[0].objIdSet);
                component.set("v.gridData", hierarchy); //Set the attribute value
                //console.log('hierarchy: ' + JSON.stringify(hierarchy));
                
            } else if(state === "ERROR"){
                console.log('Error: ' + JSON.stringify(response.error));
            } else {
                console.log('Unknown problem, state: '+ state + ', error: ' + JSON.stringify(response.error));
            }
        });
        $A.enqueueAction(action); // Invoke the Apex method
        
	},
    
    expandAll : function (component, event, helper) {
        
        //Expand all
        var tree = component.find('mytreeCaseHierarchy');
        tree.expandAll();  
        
    },
    openTab: function(component, event, helper, idCase) {
        
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            pageReference: {
                "type": "standard__recordPage",
                "attributes": {
                    "recordId":idCase,
                    "actionName":"view"
                },
                "state": {}
            },
            focus: true
        }).then(function(response) {
            workspaceAPI.getTabInfo({
                tabId: response
        }).then(function(tabInfo) {
            console.log("The recordId for this tab is: " + tabInfo.recordId);
        });
        }).catch(function(error) {
            console.log(error);
        });
    },
        
    loadHierarchyColumns : function(component, sObjName, isConsoleLayout) {
        
        var action = component.get("c.getColumnJSON"); //Get a pointer to apex method
        
        action.setParams({
            fieldSetName : 'HRS_Hierarchy',
            objectName : sObjName,
            isConsoleLayout : isConsoleLayout
        });
        
        action.setCallback(this, function(response){
            var state = response.getState(); //Fetch the response state
            if(component.isValid() && state ==="SUCCESS"){
                var columnsJSON = response.getReturnValue();
                var columns = JSON.parse(columnsJSON);
                component.set('v.gridColumns', columns);
                console.log('columns: ' + JSON.stringify(columns));
                
            } else if(state === "ERROR"){
                console.log('Error: ' + JSON.stringify(response.error));
            } else {
                console.log('Unknown problem, state: '+ state + ', error: ' + JSON.stringify(response.error));
            }
        });
        $A.enqueueAction(action); // Invoke the Apex method
        
        
        
        
        
            /*** Defining columns ***/
        /*
            var columns = [
                {
                	type: 'text',
                    fieldName: 'caseNumber',
                    title: 'caseNumber',
                    label: 'Case Number', 
                    initialWidth: 220
                },
                {
                    type: 'text',
                    fieldName: 'type',
                    title: 'type',
                    label: 'Type',
                    initialWidth: 110
                },
                {
                	type: 'button',
                    fieldName: 'idCase',
                    label: 'Subject', 
                	typeAttributes: {
                        label: { fieldName: 'subject' },
                        name: 'openCase',
                        //iconName: 'standard:case',
                		variant: 'Base'
                    }
                },               
                {
                    type: 'text',
                    fieldName: 'status',
                    title: 'status',
                    label: 'Status',
                    initialWidth: 90
                }
                /*{
                    type: 'url',
                    fieldName: 'idCase',
                    label: 'Case Number',
                    typeAttributes: {
                        label: { fieldName: 'caseNumber' },
                		target: 'blank'
                    }
                },
                {
                    type: 'text',
                    fieldName: 'idCase',
                    label: 'Id'
                }
                
            ];
   
            component.set('v.gridColumns', columns); */
        
    },


    formatHierarchy : function(helper, object, listAttributes) {
        
        if(object.obj){
            helper.copyAttributes(object, object.obj, listAttributes);
        }
        if(object._children){            
            for(var x in object._children){
                helper.formatHierarchy(helper, object._children[x], listAttributes);
            }
        }
        console.log('formatHierarchy - RESULT: '+JSON.stringify(object));
    },
  
    copyAttributes : function(obj1, obj2, listAttributes){
  	
        for(var x in listAttributes){
            if(listAttributes[x] != 'attributes' && listAttributes[x] != 'Id'){
                var attr = listAttributes[x];
                obj1[attr] = obj2[attr];    
            }    		
    	}
        delete obj1.obj;
  	}

    
})