({
	doInit : function(component, event, helper) {
        
        var sObjId = component.get("v.recordId");
        var sObjName = component.get("v.sObjectName");
        var isConsoleLayout = component.get("v.isConsoleLayout");
        
        if(sObjId){
            helper.getCaseHierarchiesQuick(component, helper, sObjId, sObjName);
        }
        
        helper.loadHierarchyColumns(component, sObjName, isConsoleLayout);
        

	},
    
    expandAll : function (component, event, helper) {
    	helper.expandAll(component, event, helper);
    },
    
    handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'openCase':
                helper.openTab(component, event, helper, row.objId);
                break;
            // You might have other buttons as well, handle them in the same way
            //case 'action2':
            //    console.log('action2 sample');
            //    break;
            
        }
    }
    
    
    
    
 
})