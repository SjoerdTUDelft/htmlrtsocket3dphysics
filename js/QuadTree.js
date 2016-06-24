QuadTree = function(CellSize) {
	this.GridStaticObjects = new Array(20)
	this.GridMobileObjects = new Array()
	this.invCellSize = 1/CellSize;
	for(k in this.GridStaticObjects) {
		this.GridStaticObjects[k] = new Array(20)
	}


}

QuadTree.prototype = {
	constructor : QuadTree,
	addStatic : function(elements) {
		for(var i = 0; i < elements.length; i ++) {
			var x = Math.round(elements.position.x/5)
			var y = Math.round(elements.position.y/5)
		}
	},
	addMobile : function(elements) {
		for(var i = 0; i < elements.length; i ++) {




		}

	},
	clearMobile : function() {


	},
	update : function() {



	}

}

