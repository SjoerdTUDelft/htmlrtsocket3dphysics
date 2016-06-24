THREE.Matrix3.prototype.inverseInertia = function() {
	this.elements[0] = 1/this.elements[0]
	this.elements[4] = 1/this.elements[4]
	this.elements[8] = 1/this.elements[8]
}

THREE.Matrix3.prototype.inverse = function(m) {
		var me = m.elements;
		var te = this.elements;

		var a11 = me[ 0 ], a12 = me[ 3 ], a13 = me[ 6 ],
		    a21 = me[ 1 ], a22 = me[ 4 ], a23 = me[ 7 ],
		    a31 = me[ 2 ], a32 = me[ 5 ], a33 = me[ 8 ],
		    temp1 = a22*a33 - a23*a32,
		    temp2 = a23*a31 - a21*a33,
		    temp3 = a21*a32 - a22*a31;

		var det = a11*temp1 + a12 *temp2 + a13*temp3; 

		te[ 0 ] = (temp1)/det;
		te[ 3 ] = (a13*a32 - a12*a33)/det;
		te[ 6 ] = (a12*a23 - a13*a22)/det;

		te[ 1 ] = (temp2)/det;
		te[ 4 ] = (a11*a33 - a13*a31)/det;
		te[ 7 ] = (a13*a21 - a11*a23)/det;

		te[ 2 ] = (temp3)/det;
		te[ 5 ] = (a12*a31 - a11*a32)/det;
		te[ 8 ] = (a11*a22 - a12*a21)/det;

		return this;
}

THREE.Matrix3.prototype.multiplyMatrices = function(a,b) {
		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
		var a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
		var a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

		var b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
		var b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
		var b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];


		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
		te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
		te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
		te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
		te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
		te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
		te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

		return this;
}

THREE.Matrix3.prototype.multiply = function(a) {
		var ae = this.elements;
		var be = a.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
		var a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
		var a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

		var b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
		var b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
		var b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];


		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
		te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
		te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
		te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
		te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
		te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
		te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

		return this;
}

THREE.Matrix3.prototype.setSkewSymmetric = function(v) {
	var te = this.elements;
		te[ 0 ] = 0;
		te[ 3 ] = -v.z;
		te[ 6 ] = v.y;
		te[ 1 ] = v.z;
		te[ 4 ] = 0;
		te[ 7 ] = -v.x;
		te[ 2 ] = -v.y;
		te[ 5 ] = v.x;
		te[ 8 ] = 0;
}

THREE.Matrix3.prototype.add = function(m) {
	var te = this.elements;
	var me = m.elements;
		te[ 0 ] += me[ 0 ]
		te[ 1 ] += me[ 1 ]
		te[ 2 ] += me[ 2 ]
		te[ 3 ] += me[ 3 ]
		te[ 4 ] += me[ 4 ]
		te[ 5 ] += me[ 5 ]
		te[ 6 ] += me[ 6 ]
		te[ 7 ] += me[ 7 ]
		te[ 8 ] += me[ 8 ]
}

THREE.Matrix3.prototype.getRotationMat4 = function(m) {
		var ae = m.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ];

		te[ 0 ] = a11;
		te[ 1 ] = a21;
		te[ 2 ] = a31;
		te[ 3 ] = a12;
		te[ 4 ] = a22;
		te[ 5 ] = a32;
		te[ 6 ] = a13;
		te[ 7 ] = a23;
		te[ 8 ] = a33;

		return this;
}

THREE.Vector3.prototype.applyTransposeMatrix3 = function ( m ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 1 ] * y + e[ 2 ] * z;
		this.y = e[ 3 ] * x + e[ 4 ] * y + e[ 5 ] * z;
		this.z = e[ 6 ] * x + e[ 7 ] * y + e[ 8 ] * z;

		return this;
}

	
THREE.Vector3.prototype.setZero = function() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
}

THREE.Vector3.prototype.IsZero = function(v) {
	return (v.x === 0 && v.y === 0 && v.z === 0) 
}