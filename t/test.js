





function fname_s_01(cdm)
{
	var wall = infProject.scene.array.wall[0];
	
	
	
	 
	cdm.wall = wall;
	cdm.type = 'wallRedBlue';
	cdm.side = 'wall_length_1';
	
	var x = $('[nameId="size-wall-length"]').val();
	var y = $('[nameId="size-wall-height"]').val();
	var z = $('[nameId="size-wall-width"]').val();
	
	
	if(1==1)
	{
		var v = wall.userData.wall.v;
		
		if(x == undefined) { x = '' + (v[6].x - v[0].x); }
		if(y == undefined) { y = '' + (v[1].y - v[0].y); }		
		if(z == undefined) { z = '' + (Math.abs(v[4].z) + Math.abs(v[0].z)); }		
		
		x = x.replace(",", ".");
		y = y.replace(",", ".");
		z = z.replace(",", ".");
		
		var x2 = v[6].x - v[0].x;
		var y2 = v[1].y - v[0].y;		
		var z2 = Math.abs(v[4].z) + Math.abs(v[0].z);
		
		x = (fname_s_06(x)) ? x : x2;
		y = (fname_s_06(y)) ? y : y2;
		z = (fname_s_06(z)) ? z : z2;  
	}
	
	
	
	if(1==1)
	{
		if(x > 30) { x = 30; }
		else if(x < 0.5) { x = 0.5; }

		if(y > 10) { y = 10; }
		else if(y < 0.1) { y = 0.1; }	
		
		if(z > 10) { z = 10; }
		else if(z < 0.02) { z = 0.02; }		
	}	
	
	cdm.length = x;
	cdm.height = y;
	cdm.width = z;	
	
	
	fname_s_02(cdm);	
	
	renderCamera();
}



function fname_s_02(cdm)
{
	var wall = cdm.wall;
	var value = cdm.length;
	
	var wallR = fname_s_0119(wall);
	fname_s_041(wallR);

	var p1 = wall.userData.wall.p[1];
	var p0 = wall.userData.wall.p[0];

	var walls = [...new Set([...p0.w, ...p1.w])];	
	
	
	
	if(cdm.height)
	{
		var h2 = Number(cdm.height);
		
		var v = wall.geometry.vertices;	
		v[1].y = h2;
		v[3].y = h2;
		v[5].y = h2;
		v[7].y = h2;
		v[9].y = h2;
		v[11].y = h2;
		wall.geometry.verticesNeedUpdate = true; 
		wall.geometry.elementsNeedUpdate = true;

		wall.userData.wall.height_1 = Math.round(h2 * 100) / 100;
	}
 
	
	if(cdm.width)
	{
		var z = cdm.width/2;
		
		var v = wall.geometry.vertices;	
		v[0].z = v[1].z = v[6].z = v[7].z = z;
		v[4].z = v[5].z = v[10].z = v[11].z = -z;	
		wall.geometry.verticesNeedUpdate = true;
		wall.geometry.elementsNeedUpdate = true;
		
		
		
		for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
		{ 
			var wd = wall.userData.wall.arrO[i];	
			var v = wd.geometry.vertices;
			var f = wd.userData.door.form.v;
			var v2 = wall.geometry.vertices;
			
			for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = v2[4].z; }
			for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = v2[0].z; }	

			wd.geometry.verticesNeedUpdate = true; 
			wd.geometry.elementsNeedUpdate = true;
			wd.geometry.computeBoundingSphere();
			wd.geometry.computeBoundingBox();
			wd.geometry.computeFaceNormals();		
		}

		wall.userData.wall.width = Math.round(cdm.width * 100) / 100;;
	}
 
	
	var ns = 0;
	var flag = true;
	while ( flag )
	{	 
		var v = wall.userData.wall.v;

		var d = 0;
		
		if(cdm.side == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x );  } 
		else if(cdm.side == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x );  }
		
		
		var sub = (value - d) / 1;
		if(cdm.type == 'wallRedBlue') { sub /= 2; }	
		
		var dir = new THREE.Vector3().subVectors(p1.position, p0.position).normalize();
		var dir = new THREE.Vector3().addScaledVector( dir, sub );	

		if(cdm.type == 'wallBlueDot')
		{ 
			var offset = new THREE.Vector3().addVectors( p1.position, dir ); 
			p1.position.copy( offset ); 
		}
		else if(cdm.type == 'wallRedDot')
		{ 
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset ); 
			wall.position.copy( offset );
		}
		else if(cdm.type == 'wallRedBlue')
		{ 			
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset );
			wall.position.copy( offset );
			
			p1.position.copy( new THREE.Vector3().addVectors( p1.position, dir ) );				
		}

		
		for ( var i = 0; i < walls.length; i++ )
		{
			fname_s_03(walls[i]);
		}			 		 
		
		fname_s_0121(p0);
		fname_s_0121(p1);
		fname_s_044( [wall] );
		if(cdm.side == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x ); }
		else if(cdm.side == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x ); }
		

		if(value - d == 0){ flag = false; }
		
		if(ns > 5){ flag = false; }
		ns++;
	} 	
	 
	fname_s_044( wallR );		
	fname_s_0161( fname_s_0131(wall) );  				 			
	
	fname_s_029({obj: wall});

	fname_s_042(wallR);
}

	




function fname_s_03(wall, cdm) 
{
	
	var v = wall.geometry.vertices;
	var p = wall.userData.wall.p;
	
	
	var f1 = false;	
	var f2 = false;	
	
	f1 = !fname_s_021(p[0].userData.point.last.pos, p[0].position); 	
	f2 = !fname_s_021(p[1].userData.point.last.pos, p[1].position); 	
	
	
	if(f1 && f2)
	{
		var offset_1 = new THREE.Vector3().subVectors(p[0].position, p[0].userData.point.last.pos);
		var offset_2 = new THREE.Vector3().subVectors(p[1].position, p[1].userData.point.last.pos);
		
		var equal = fname_s_021(offset_1, offset_2);
		
		
		if(equal)
		{
			var offset = new THREE.Vector3().subVectors(p[0].position, wall.position);
			
			wall.position.copy(p[0].position);
						
			for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
			{
				wall.userData.wall.arrO[i].position.add(offset);
			}
			
			return;
		}
	}	
	
	
	var dist = p[0].position.distanceTo(p[1].position);
	
	v[0].x = v[1].x = v[2].x = v[3].x = v[4].x = v[5].x = 0;
	v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = dist;
 
	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	wall.geometry.computeBoundingBox();	
	wall.geometry.computeBoundingSphere();	
	wall.geometry.computeFaceNormals();	

	var dir = new THREE.Vector3().subVectors(p[0].position, p[1].position).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);

	wall.position.copy( p[0].position );


	
	
	if(cdm)
	{
		if(cdm.point)	
		{
			if(cdm.point == p[0]) { f1 = true; }
			if(cdm.point == p[1]) { f2 = true; }
		}
	}
	
	
	if(f2){ var dir = new THREE.Vector3().subVectors( p[0].position, p[1].position ).normalize(); }
	else { var dir = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize(); }
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var wd = wall.userData.wall.arrO[i];	

		if(f2)
		{
			var startPos = new THREE.Vector3(p[0].position.x, 0, p[0].position.z);
			var p1 = p[0].position;			
		}
		else
		{
			var startPos = new THREE.Vector3(p[1].position.x, 0, p[1].position.z);
			var p1 = p[1].position;
		}
		
		var dist = startPos.distanceTo(new THREE.Vector3(wd.position.x, 0, wd.position.z));
		
		
		var pos = new THREE.Vector3().addScaledVector( dir, -dist );
		pos = new THREE.Vector3().addVectors( p1, pos );
		
		wd.position.x = pos.x;
		wd.position.z = pos.z;
		wd.rotation.copy( wall.rotation );
	}			
}






function fname_s_04(cdm) 
{
	var wall = cdm.wall;
	
	var width = cdm.width.value;
	var offset = cdm.offset;
	
	if(!wall){ return; } 
	if(wall.userData.tag != 'wall'){ return; } 
	
	var width = fname_s_0245({ value: width, unit: 1, limit: {min: 0.01, max: 1} });
	
	if(!width) 
	{
		$('[nameid="size_wall_width_1"]').val(wall.userData.wall.width);
		
		return;
	}		

	var width = width.num; 
	
	var wallR = fname_s_0119(wall);
	
	fname_s_041(wallR);
			
	var v = wall.geometry.vertices;
	
	var z = [0,0];
	
	if(offset == 'wallRedBlueArrow')
	{ 	
		width = (width < 0.01) ? 0.01 : width;
		width /= 2;		
		z = [width, -width];		
		var value = Math.round(width * 2 * 1000);
	}
	else if(offset == 'wallBlueArrow')
	{ 
		width = (Math.abs(Math.abs(v[4].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[4].z) : width;   		
		z = [width, v[4].z];
		var value = width * 1000;
	}
	else if(offset == 'wallRedArrow')
	{		 
		width = (Math.abs(Math.abs(v[0].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[0].z) : width;    		
		z = [v[0].z, -width];
		var value = width * 1000;
	}

	v[0].z = v[1].z = v[6].z = v[7].z = z[0];
	v[4].z = v[5].z = v[10].z = v[11].z = z[1];	

	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	
	wall.geometry.computeBoundingSphere();
	wall.geometry.computeBoundingBox();
	wall.geometry.computeFaceNormals();	
	
	var width = Math.abs(v[0].z) + Math.abs(v[4].z);	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.offsetZ = (v[0].z + v[4].z)/2;	 

	
	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1];
	fname_s_0122(p0);	
    fname_s_0122(p1);	
	
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{ 
		var wd = wall.userData.wall.arrO[i];	
		var v = wd.geometry.vertices;
		var f = wd.userData.door.form.v;
		var v2 = wall.geometry.vertices;
		
		for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = v2[4].z; }
		for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = v2[0].z; }	

		wd.geometry.verticesNeedUpdate = true; 
		wd.geometry.elementsNeedUpdate = true;
		wd.geometry.computeBoundingSphere();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeFaceNormals();		
	}	
	
	fname_s_044( wallR );	 				
	fname_s_046( fname_s_0131(wall) );
	
	fname_s_042(wallR);
	
	$('[nameId="size_wall_width_1"]').val(wall.userData.wall.width);
	
	renderCamera();
}







function fname_s_05(cdm)
{  	
	var height = fname_s_0245({ value: cdm.height, unit: 1, limit: {min: 0.1, max: 5} });
	
	if(!height) 
	{
		return;
	}		
	
	if(cdm.load)
	{
		
	}
	else
	{	
		fname_s_041( infProject.scene.array.wall );
		
		for ( var i = 0; i < infProject.scene.array.wall.length; i++ )
		{
			var v = infProject.scene.array.wall[i].geometry.vertices;
			
			v[1].y = height.num;
			v[3].y = height.num;
			v[5].y = height.num;
			v[7].y = height.num;
			v[9].y = height.num;
			v[11].y = height.num;
			infProject.scene.array.wall[i].geometry.verticesNeedUpdate = true;
			infProject.scene.array.wall[i].geometry.elementsNeedUpdate = true;
			
			infProject.scene.array.wall[i].userData.wall.height_1 = height.num;
		}
		
		fname_s_044( infProject.scene.array.wall );
		fname_s_042( infProject.scene.array.wall );			
	}
	
	if(cdm.input)
	{  
		$('[nameId="rp_floor_height"]').val(height.num);
	}
	
	if(cdm.globalHeight)
	{
		infProject.settings.height = height.num;  
	}		
	
	renderCamera();
}
	
	









function fname_s_06(n) 
{   
   return !isNaN(parseFloat(n)) && isFinite(n);   
   
   
   
}




function fname_s_07(point)
{
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < point.w.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(point.w[i] == wall[i2]) { continue; }
			
			if(Math.abs(point.position.y - wall[i2].userData.wall.p[0].position.y) > 0.3) continue;		
			
			var p0 = point.w[i].userData.wall.p[0].position;
			var p1 = point.w[i].userData.wall.p[1].position;
			var p2 = wall[i2].userData.wall.p[0].position;
			var p3 = wall[i2].userData.wall.p[1].position;
			
			if(fname_s_0125(p0, p1, p2, p3)) { return true; }	
		}
	}
	
	return false;  
}




function fname_s_08(a1, a2, b1, b2)
{
	var t1 = fname_s_011(a1.x, a1.z, a2.x, a2.z);
	var t2 = fname_s_011(b1.x, b1.z, b2.x, b2.z);

	var point = new THREE.Vector3();
	var f1 = fname_s_012(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001){ return new THREE.Vector3(a2.x, 0, a2.z); } 
	
	point.x = fname_s_012(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = fname_s_012(t1[0], -t1[2], t2[0], -t2[2]) / f1;	
	
	
	
	return point;
}




function fname_s_09(a1, a2, b1, b2)
{
	var t1 = fname_s_011(a1.x, a1.z, a2.x, a2.z);
	var t2 = fname_s_011(b1.x, b1.z, b2.x, b2.z);
	var f1 = fname_s_012(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001)
	{ 
		var s1 = new THREE.Vector3().subVectors( a1, b1 );
		var s2 = new THREE.Vector3().addVectors( s1.divideScalar( 2 ), b1 );
		
		return [new THREE.Vector3(s2.x, 0, s2.z), true]; 
	} 
	
	var point = new THREE.Vector3();
	point.x = fname_s_012(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = fname_s_012(t1[0], -t1[2], t2[0], -t2[2]) / f1;	
	
	
	
	return [point, false];
}




function fname_s_010(a1, a2, b1, b2)
{
	var t1 = fname_s_011(a1.x, a1.z, a2.x, a2.z);
	var t2 = fname_s_011(b1.x, b1.z, b2.x, b2.z);

	var point = new THREE.Vector3();
	var f1 = fname_s_012(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001){ return [new THREE.Vector3(a2.x, 0, a2.z), true]; } 
	
	point.x = fname_s_012(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = fname_s_012(t1[0], -t1[2], t2[0], -t2[2]) / f1;			 
	
	return [point, false];
}



function fname_s_011(x1, y1, x2, y2)
{
	var a = y1 - y2;
	var b = x2 - x1;
	var c = x1 * y2 - x2 * y1;

	return [ a, b, c ];
}

	
function fname_s_012(x1, y1, x2, y2)
{
	return x1 * y2 - x2 * y1;
}




function fname_s_013(a, b, c, d)
{
	return fname_s_014(a.x, b.x, c.x, d.x) && fname_s_014(a.z, b.z, c.z, d.z) && fname_s_015(a, b, c) * fname_s_015(a, b, d) <= 0 && fname_s_015(c, d, a) * fname_s_015(c, d, b) <= 0;
}

function fname_s_014(a, b, c, d)
{
	if (a > b) { var res = fname_s_016(a, b); a = res[0]; b = res[1]; }
	if (c > d) { var res = fname_s_016(c, d); c = res[0]; d = res[1]; }
	return Math.max(a, c) <= Math.min(b, d);
}

function fname_s_015(a, b, c) { return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x); }


function fname_s_016(a, b) { var c; c = a; a = b; b = c; return [a, b]; }



 

function fname_s_017(A,B,C){
    var x1=A.x, y1=A.z, x2=B.x, y2=B.z, x3=C.x, y3=C.z;
    var px = x2-x1, py = y2-y1, dAB = px*px + py*py;
    var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
    var x = x1 + u * px, z = y1 + u * py;
    return {x:x, y:0, z:z}; 
} 



function fname_s_018(A,B,C)
{	
	var AB = { x : B.x - A.x, y : B.z - A.z };
	var CD = { x : C.x - A.x, y : C.z - A.z };
	var r1 = AB.x * CD.x + AB.y * CD.y;				

	var AB = { x : A.x - B.x, y : A.z - B.z };
	var CD = { x : C.x - B.x, y : C.z - B.z };
	var r2 = AB.x * CD.x + AB.y * CD.y;

	var cross = (r1 < 0 | r2 < 0) ? false : true;	
	
	return cross;
}

 

function fname_s_019(p1, p2, M)
{	
	var urv = fname_s_011(p1.x, p1.z, p2.x, p2.z);
	
	var A = urv[0];
	var B = urv[1];
	var C = urv[2];
	
	return Math.abs( (A * M.x + B * M.z + C) / Math.sqrt( (A * A) + (B * B) ) );
}







function fname_s_020(point, arrP)
{
	var p = arrP;
	var result = false;
	var j = p.length - 1;
	for (var i = 0; i < p.length; i++) 
	{
		if ( (p[i].position.z < point.position.z && p[j].position.z >= point.position.z || p[j].position.z < point.position.z && p[i].position.z >= point.position.z) &&
			 (p[i].position.x + (point.position.z - p[i].position.z) / (p[j].position.z - p[i].position.z) * (p[j].position.x - p[i].position.x) < point.position.x) )
			result = !result;
		j = i;
	}
	
	return result;
}



function fname_s_021(pos1, pos2, cdm)
{
	if(!cdm) cdm = {};
	
	var x = pos1.x - pos2.x;
	var y = pos1.y - pos2.y;
	var z = pos1.z - pos2.z;
	
	var kof = (cdm.kof) ? cdm.kof : 0.01;
	
	
	var equals = true;
	if(Math.abs(x) > kof){ equals = false; }
	if(Math.abs(y) > kof){ equals = false; }
	if(Math.abs(z) > kof){ equals = false; }

	return equals;
}








function fname_s_022(cdm)
{
	
	for(var i = 0; i < infProject.catalog.obj.length; i++)
	{
		var o = infProject.catalog.obj[i];
		
		if(o.stopUI) continue;
		
		var str = 
		'<div class="right_panel_1_1_list_item" add_lotid="'+o.lotid+'">\
			<div class="right_panel_1_1_list_item_text">'
			+o.name+
			'</div>\
		</div>';
		
		
		var el = $(str).appendTo('[list_ui="catalog"]');
		var n = o.lotid;
		(function(n) 
		{
			el.on('mousedown', function(){ fname_s_active_int({button: 'add_lotid', value: n}); });	
		}(n));		
	}
	
}




function fname_s_023(cdm)
{
	
	for(var i = 0; i < infProject.catalog.texture.length; i++)
	{
		var o = infProject.catalog.texture[i];
		o.name = 'img';
		var str = 
		'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
			<img src="'+o.url+'" nameId="">\
		</div>';
		 
		$('[list_ui="catalog_texture_1"]').append(str);
	}	
}

function fname_s_024(cdm)
{
	
	for(var i = 0; i < infProject.catalog.texture.length; i++)
	{
		var o = infProject.catalog.texture[i];
		o.name = 'img';
		var str = 
		'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
			<img src="'+o.url+'" nameId="">\
		</div>';
		 
		$('[list_ui="catalog_texture_2"]').append(str);
	}	
}


function fname_s_025(cdm)
{
	if(cdm.type == 1)
	{
		$('[nameId="rp_catalog_texture_1"]').hide(); 
		$('[nameId="rp_block_wall_texture_1"]').show(); 		
	}
	else
	{
		$('[nameId="rp_catalog_texture_1"]').show(); 
		$('[nameId="rp_block_wall_texture_1"]').hide(); 		
	}
}


function fname_s_026(cdm)
{
	if(cdm.type == 1)
	{
		$('[nameId="rp_catalog_texture_2"]').hide(); 
		$('[nameId="rp_block_room_texture_1"]').show();  		
	}
	else
	{
		$('[nameId="rp_catalog_texture_2"]').show(); 
		$('[nameId="rp_block_room_texture_1"]').hide(); 		
	}
}



function fname_s_027(cdm)
{
	if(cdm.type == 'add')
	{
		var obj = cdm.o;
		
		var tag = obj.userData.tag; 
		
		if(tag == 'obj')
		{   
			var str = 
			'<div class="right_panel_1_1_list_item" uuid="'+obj.uuid+'">\
			<div class="right_panel_1_1_list_item_text">'+obj.userData.obj3D.nameRus+'</div>\
			</div>';			
		}
		else
		{
			return;
		}
		
		$('[list_ui="wf"]').prepend(str);
		
		var q = $('[list_ui="wf"]')[0].children[0];
		q.uuid = obj.uuid;
		
		infProject.ui.list_wf[infProject.ui.list_wf.length] = q;	
	}
	
	if(cdm.type == 'delete')
	{
		for(var i = 0; i < infProject.ui.list_wf.length; i++)
		{
			if(infProject.ui.list_wf[i].uuid == cdm.uuid) { infProject.ui.list_wf[i].remove(); break; }
		}				
	}	
}



function fname_s_028(cdm)
{
	$('[nameId="wrap_catalog"]').hide();
	$('[nameId="wrap_list_obj"]').hide();
	$('[nameId="wrap_object"]').hide();
	$('[nameId="wrap_plan"]').hide();
	
	
	var name = '';
	
	
	if(cdm.el) { name = cdm.el.attributes.nameId.value; }
	else if(cdm.name) { name = cdm.name; }
	else if(cdm.current) { name = infProject.ui.right_menu.active; }
	
	
	
	if(name == "button_wrap_catalog") 
	{
		$('[nameId="wrap_catalog"]').show();
	}
	if(name == "button_wrap_list_obj") 
	{
		$('[nameId="wrap_list_obj"]').show();
	}
	if(name == "button_wrap_object") 
	{
		$('[nameId="wrap_object"]').show(); 
	}
	if(name == "button_wrap_plan") 
	{
		$('[nameId="wrap_plan"]').show();
	}

	infProject.ui.right_menu.active = name;
}



function fname_s_029(cdm) 
{
	$('[nameId="wrap_object_1"]').hide();
	
	$('[nameId="rp_bl_light"]').hide();
	$('[nameId="bl_object_3d"]').hide();
	$('[nameId="rp_menu_wall"]').hide();
	$('[nameId="rp_menu_point"]').hide();
	$('[nameId="rp_item_wd_h1"]').hide();
	$('[nameId="rp_menu_wd"]').hide();
	$('[nameId="rp_menu_room"]').hide();
	
	if(!cdm) { cdm = {}; }  
	
	var obj = cdm.obj;
	
	if(!obj) return;
	
	if(obj.userData.tag == 'point')
	{
		$('[nameId="rp_menu_point"]').show();
	}	
	else if(obj.userData.tag == 'wall')
	{
		
		if(cdm.side)
		{
			$('[nameId="rp_button_side_texture_1"]').hide();
			$('[nameId="but_back_catalog_texture_1"]').hide();
			$('[nameId="rp_catalog_texture_1"]').show();
		}
		else
		{
			$('[nameId="rp_button_side_texture_1"]').show();
			$('[nameId="but_back_catalog_texture_1"]').show();
			$('[nameId="rp_catalog_texture_1"]').hide();
			fname_s_025({type: 1});
			
			fname_s_034({obj: obj});			

			obj.userData.wall.html.label[0].textContent = 'A';
			obj.userData.wall.html.label[1].textContent = 'B';
						
			fname_s_0211({elem: obj.userData.wall.html.label[0]});
			fname_s_0211({elem: obj.userData.wall.html.label[1]});			
		}
		
		$('[nameId="rp_menu_wall"]').show();
		$('[nameId="size_wall_width_1"]').val(obj.userData.wall.width);				
	}
	else if(obj.userData.tag == 'door')
	{
		$('[nameId="rp_menu_wd"]').show();
	}
	else if(obj.userData.tag == 'window')
	{
		$('[nameId="rp_item_wd_h1"]').show();
		$('[nameId="rp_menu_wd"]').show();
	}	
	else if(obj.userData.tag == 'obj')
	{
		if(obj.userData.obj3D.type == "light point")
		{
			$('[nameId="rp_bl_light"]').show();
			fname_s_0212({value: obj.children[1].intensity});			
		}
		    
		$('[nameId="bl_object_3d"]').show();
	}	
	else if(obj.userData.tag == 'room')
	{
		$('[nameId="rp_menu_room"]').show();
		
		fname_s_026({type: 1});
		fname_s_035({obj: obj});
	}		

	$('[nameId="wrap_object_1"]').show(); 	
	
}




function fname_s_030(cdm)
{
	if(!cdm) { cdm = {}; }	
	if(!cdm.obj) return;
	
	var obj = cdm.obj;
	
	$('[nameId="rp_obj_name"]').val(obj.userData.obj3D.nameRus);
}




function fname_s_031(cdm)
{
	var obj = cdm.obj;
	var nameId = cdm.nameId;
	var uuid = cdm.uuid;
	var nameRus = cdm.nameRus;
	
	
	var str = 
	'<div class="right_panel_1_1_list_item" uuid="'+uuid+'" group_item_obj="">\
	<div class="right_panel_1_1_list_item_text">'+nameRus+'</div>\
	</div>';	
	
	$('[nameId="'+nameId+'"]').append(str); 
	var el = $($('[nameId="'+nameId+'"]')[0].children[$('[nameId="'+nameId+'"]')[0].children.length - 1]);			
}




function fname_s_032(cdm)
{
	
	$('[nameId="rp_wall_width_1"]').val(infProject.settings.wall.width);
	
	$('[nameId="rp_door_length_1"]').val(infProject.settings.door.width);
	$('[nameId="rp_door_height_1"]').val(infProject.settings.door.height);
	
	$('[nameId="rp_wind_length_1"]').val(infProject.settings.wind.width);
	$('[nameId="rp_wind_height_1"]').val(infProject.settings.wind.height);
	$('[nameId="rp_wind_above_floor_1"]').val(infProject.settings.wind.h1);
	
	$('[nameId="rp_floor_height"]').val(infProject.settings.height);
}



function fname_s_033(cdm) 
{
	var el = cdm.el;
	var value = el.val();
	
	var inf = null;
	if(cdm.el[0] == $('[nameId="rp_wall_width_1"]')[0]) { var inf = { json: infProject.settings.wall, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_door_length_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_door_height_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'height' }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_length_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_height_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'height' }; }	
	else if(cdm.el[0] == $('[nameId="rp_wind_above_floor_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'h1' }; }	
	else { return; }	
	
	var res = fname_s_0245({ value: value, unit: 1, limit: {min: 0.01, max: 5} });	
	
	if(!res) 
	{
		el.val(inf.json[inf.name]);
		return;
	}
	
	el.val(res.num);
	
	inf.json[inf.name] = res.num; 
}




function fname_s_034(cdm) 
{
	$('[nameId="wall_texture_1img"]').attr('src', cdm.obj.userData.material[1].img);  
	$('[nameId="wall_texture_2img"]').attr('src', cdm.obj.userData.material[2].img);
}




function fname_s_035(cdm) 
{
	var res = fname_s_0163({obj: cdm.obj});
	
	$('[nameId="wall_texture_1img"]').attr('src', res.floor.userData.material.img);  
	if(res.ceiling.userData.material) { $('[nameId="wall_texture_2img"]').attr('src', res.ceiling.userData.material.img); }
}







function fname_s_036(cdm)
{
	var arr = cdm.arr;
	var floor = infProject.scene.array.floor;
	
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < floor.length; i2++ )
		{
			if(arr[i].id !== floor[i2].userData.id) continue;
			
			floor[i].userData.room.zone.id = arr[i].zone;
			
			if(infProject.settings.floor.label.visible)  
			{ 				 
				fname_s_037({id: floor[i].userData.room.zone.id, obj: floor[i]});			
			}
			
			break;
		}		
	}
	
	renderCamera();		
}



function fname_s_037(cdm)
{ 
	var type = infProject.settings.room.type;	
	
	var id = cdm.id;
	var obj = null;
	
	if(cdm.button) { obj = clickO.last_obj; }
	if(cdm.obj) { obj = cdm.obj; }
	
	var elem = obj.userData.room.html.label;
	elem.style.display = 'none';
	elem.userData.elem.show = false;
	
	
	
	if(!id) return;
	if(!obj) return;
	if(type.length == 0) return;	
	
	for(var i = 0; i < type.length; i++)
	{ 
		if(type[i].id !== id) continue;
		
		obj.userData.room.zone.id = type[i].id;
		obj.userData.room.zone.name = type[i].title;		
		
		elem.textContent = type[i].title;
		elem.style.display = 'block';
		elem.userData.elem.show = true;
		
		fname_s_0211({elem: elem});
		
		break;
	}
	
	renderCamera();
}






function fname_s_038( wd, wall )  
{
	
	
	if(!wall) { wall = wd.userData.door.wall; }		else {  }		
	var p1 = wall.userData.wall.p[0].position;
	var p2 = wall.userData.wall.p[1].position;	
	var d = p1.distanceTo( p2 );		
	
	wall.geometry = fname_s_0218(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);		
		var v = wall.geometry.vertices;
	
	for ( var i = 0; i < v.length; i++ ) { v[i] = wall.userData.wall.v[i].clone(); }
	
	
	fname_s_0235( wall ); 
	
		var arrO = wall.userData.wall.arrO;
	
	for ( var n = 0; n < arrO.length; n++ )
	{
		if(arrO[n] == wd) continue;
		
		var objClone = fname_s_039( arrO[n] ); 

		var wdBSP = new ThreeBSP( objClone );    
		var wallBSP = new ThreeBSP( wall ); 					var newBSP = wallBSP.subtract( wdBSP );				wall.geometry = newBSP.toGeometry();	
	}
	
	if(arrO.length > 1 || wd == null)
	{
		wall.geometry.computeFaceNormals();

		for ( var i = 0; i < wall.geometry.faces.length; i++ )
		{
			wall.geometry.faces[i].normal.normalize();
			if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
			else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
			else if(wall.geometry.faces[i].normal.y == 1) { wall.geometry.faces[i].materialIndex = 3; }
			else if(wall.geometry.faces[i].normal.y == -1) { wall.geometry.faces[i].materialIndex = 3; }
		}		
	}			
	
	return wall; 
}




function fname_s_039( wd )
{
		var obj = new THREE.Mesh();
	obj.geometry = wd.geometry.clone(); 
	obj.position.copy( wd.position );
	obj.rotation.copy( wd.rotation );
	
		var minZ = wd.userData.door.form.v.minZ;
	var maxZ = wd.userData.door.form.v.maxZ;
	
	var v = obj.geometry.vertices;
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z -= 3.2; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z += 3.2; }

	return obj;		
}



function fname_s_040( wd, objsBSP, wall )
{  
	if(!wall) wall = wd.userData.door.wall;
	
	var wallClone = objsBSP.wall;
	var wdClone = objsBSP.wd;
	
	wdClone.position.copy( wd.position );

	var wdBSP = new ThreeBSP( wdClone );    
	var wallBSP = new ThreeBSP( wallClone ); 				var newBSP = wallBSP.subtract( wdBSP );					
	
	wallClone.geometry.dispose();
	wall.geometry.dispose();	
	
	wall.geometry = newBSP.toGeometry();		
	wall.geometry.computeFaceNormals();
 
	for ( var i = 0; i < wall.geometry.faces.length; i++ )
	{
		wall.geometry.faces[i].normal.normalize();
		if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
		else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
		else if(wall.geometry.faces[i].normal.y == 1) { wall.geometry.faces[i].materialIndex = 3; }
		else if(wall.geometry.faces[i].normal.y == -1) { wall.geometry.faces[i].materialIndex = 3; }
	}
	
}

 
 
 
 function fname_s_041( arrW ) 
{
	
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i]; 
		
		if(wall.userData.wall.arrO.length == 0) continue;
		
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;	
		var d = p1.distanceTo( p2 );		
		
		wall.geometry.dispose();
		wall.geometry = fname_s_0218(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);			 
				var v = wall.geometry.vertices;
		for ( var i2 = 0; i2 < v.length; i2++ ) { v[i2] = wall.userData.wall.v[i2].clone(); }	
		wall.geometry.verticesNeedUpdate = true;
		wall.geometry.elementsNeedUpdate = true;	
		wall.geometry.computeBoundingSphere();
	}
}
 
 
function fname_s_042( arrW )   
{
	
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i];
		
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ )
		{
			var wd = wall.userData.wall.arrO[i2];
			
			var wdClone = fname_s_039( wd );
			
			objsBSP = { wall : wall, wd : wdClone };		
			
			fname_s_040( wd, objsBSP );			
		}
		
		fname_s_0235( wall ); 
	}
} 





 
 


function fname_s_043( wall, index ) 
{
	wall.updateMatrixWorld();
	
	var v = wall.userData.wall.v;		
	
	var h = v[1].y;	
	
	if(index == 1)
	{
		var x = v[v.length - 6].x - v[0].x;
	}
	else if(index == 2)
	{
		var x = v[v.length - 2].x - v[4].x;
	}	
	
	var space = Math.round((x * h) * 100) / 100;
	
	var length = x;
	var spaceArrO = 0;
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var v = wall.userData.wall.arrO[i].geometry.vertices;
		var h = v[1].y;
		var x = Math.abs(v[0].x * 2);
		spaceArrO += Math.round((x * h) * 100) / 100;
	}
	
	space = space - spaceArrO;	
	
	return { area : space, length : length }; 
}
 

 




function fname_s_044(arrWall, Zoom)
{
	
	if(Zoom){}
	else if(typeof Zoom !== "undefined") { Zoom = false; }
	
	for ( var i = 0; i < arrWall.length; i ++ )
	{
		var wall = arrWall[i];		
		
		if(Zoom) { var v = wall.userData.wall.v; }		
		else { var v = wall.geometry.vertices; }
		
		
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;

		
		if(!Zoom)
		{
			var v = wall.geometry.vertices;
			var d1 = Math.abs( v[6].x - v[0].x );		
			var d2 = Math.abs( v[10].x - v[4].x );

			wall.userData.wall.html.label[0].textContent = Math.round(d1 * 100) / 100;
			wall.userData.wall.html.label[1].textContent = Math.round(d2 * 100) / 100;			
		}		
		 
		var dir = new THREE.Vector3().subVectors( p2, p1 );
		var rotY = Math.atan2(dir.x, dir.z);
		var pos = dir.divideScalar ( 2 ).add( p1 );
		
		if(rotY <= 0.001){ rotY += Math.PI / 2;  }
		else { rotY -= Math.PI / 2; }
		
		
		var x1 = p2.z - p1.z;
		var z1 = p1.x - p2.x;		 		 
		 
		if(infProject.settings.wall.label == 'outside' || infProject.settings.wall.label == 'inside')
		{			
			var side = (infProject.settings.wall.label == 'outside') ? 1 : 2;
			
			if(wall.userData.wall.room.side2[side])
			{ 
				var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[4].z );
			}
			else
			{
				var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[0].z );
			}						
		}
		else
		{
			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[0].z - 0.08 );
			var pos1 = new THREE.Vector3().addVectors( pos, dir );

			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[4].z + 0.08 );
			var pos2 = new THREE.Vector3().addVectors( pos, dir );
		 
			wall.userData.wall.html.label[0].userData.elem.pos = pos1;
			wall.userData.wall.html.label[1].userData.elem.pos = pos2;
			
			wall.userData.wall.html.label[0].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
			wall.userData.wall.html.label[1].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
			
			fname_s_0211({elem: wall.userData.wall.html.label[0]});
			fname_s_0211({elem: wall.userData.wall.html.label[1]});
			
		}		 


		if(!Zoom)	
		{
			var v = wall.geometry.vertices; wall.geometry.verticesNeedUpdate = true;
			for ( var i2 = 0; i2 < v.length; i2++ ) { wall.userData.wall.v[i2] = v[i2].clone(); }	
		}
	}
	
}



function fname_s_045(cdm)
{
	var wall = cdm.wall;		
	var v = wall.userData.wall.v;
	
	var d1 = Math.abs( v[6].x - v[0].x );		
	var d2 = Math.abs( v[10].x - v[4].x );

	wall.userData.wall.html.label[0].textContent = Math.round(d1 * 100) / 100 + ' м';
	wall.userData.wall.html.label[1].textContent = Math.round(d2 * 100) / 100 + ' м';
				
	fname_s_0211({elem: wall.userData.wall.html.label[0]});
	fname_s_0211({elem: wall.userData.wall.html.label[1]});	
}




function fname_s_046( room ) 
{	 
	if(!infProject.settings.floor.o) { return; }	
	
	var contour = [];	
	
	for (var u = 0; u < room.length; u++)
	{  
		var arrW = room[u].userData.room.w; 
		var arrP = room[u].userData.room.p;  
		var arrS = room[u].userData.room.s;
		var n = room[u].userData.room.w.length;
		var res = 0;
		
		contour[u] = [];
		
		if(infProject.settings.floor.areaPoint == 'inside')
		{
			for (var i = 0; i < n; i++) { arrW[i].updateMatrixWorld(); }
			
			for (var i = 0; i < n; i++) 
			{
				var ch = (arrS[i] == 0) ? 4 : 6;				
				var p1 = arrW[i].localToWorld( arrW[i].userData.wall.v[ ch ].clone() );						
				
				if (i == 0) 
				{
					var num2 = n-1;
					var num3 = i+1;
				}
				else if (i == n-1)
				{
					var num2 = i-1;
					var num3 = 0;					
				}
				else
				{
					var num2 = i-1;
					var num3 = i+1;					
				}
				
				var ch1 = (arrS[ num2 ] == 0) ? 4 : 6;
				var ch2 = (arrS[ num3 ] == 0) ? 4 : 6;
				
				var p2 = arrW[num2].localToWorld( arrW[num2].userData.wall.v[ ch1 ].clone() );
				var p3 = arrW[num3].localToWorld( arrW[num3].userData.wall.v[ ch2 ].clone() );							

				contour[u][contour[u].length] = p1;
				
				var ch = (arrS[i] == 0) ? 10 : 0;					
				var p4 = arrW[i].localToWorld( arrW[i].userData.wall.v[ ch ].clone() );	
				
				
				
				if(!fname_s_021(p3, p4, {kof: 0.001}))
				{					
					contour[u][contour[u].length] = p4;
				}
			}
		}
		else
		{
			for (i = 0; i < arrW.length; i++)
			{
				var p1 = (arrS[i] == 0) ? arrW[i].userData.wall.p[0].position : arrW[i].userData.wall.p[1].position;	
				
				if (i == 0) 
				{
					var p2 = (arrS[ n-1 ] == 0) ? arrW[n-1].userData.wall.p[0].position : arrW[n-1].userData.wall.p[1].position; 
					var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position;						
				}
				else if (i == n-1) 
				{
					var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position;
					var p3 = (arrS[ 0 ] == 0) ? arrW[0].userData.wall.p[0].position : arrW[0].userData.wall.p[1].position;								
				}
				else 
				{
					var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position; 
					var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position; 						
				}
				
				contour[u][contour[u].length] = p1;				
			}			
		}
		
		room[u].userData.room.contour = contour[u];

		for (i = 0; i < contour[u].length; i++)
		{
			if (i == 0) 
			{
				var num2 = contour[u].length - 1;
				var num3 = i+1;
			}
			else if (i == contour[u].length - 1)
			{
				var num2 = i-1;
				var num3 = 0;					
			}
			else
			{
				var num2 = i-1;
				var num3 = i+1;					
			}
			
			var p1 = contour[u][i];
			var p3 = contour[u][num2];
			var p2 = contour[u][num3];
			
			var sum = p1.x*(p2.z - p3.z); 
			sum = Math.round(sum * 100) * 10;
			res += sum;				
		}
		
		res = Math.abs( res ) / 2;
		res = Math.round(res / 10) / 100;	
		
		room[u].updateMatrixWorld();
		room[u].geometry.computeBoundingSphere();
		var pos = room[u].localToWorld( room[u].geometry.boundingSphere.center.clone() );
					
		
		room[u].userData.room.areaTxt = res;
		
		if(res < 0.5) { res = ''; }
		
		if(infProject.settings.floor.label.visible) 
		{		
			var elem = room[u].userData.room.html.label;
			
			elem.userData.elem.pos = new THREE.Vector3(pos.x, 0.2, pos.z);			
			elem.style.transform = 'translate(-50%, -50%) rotate(0deg)';
			
			fname_s_0211({elem: elem});						
		}
	}

	return contour;
}




function fname_s_047( arrP )
{  
	var res = 0;
	var n = arrP.length;
	
	for (i = 0; i < n; i++) 
	{
		var p1 = arrP[i].position;
		
		if (i == 0)
		{
			var p2 = arrP[n-1].position;
			var p3 = arrP[i+1].position;					
		}
		else if (i == n-1)
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[0].position;			
		}
		else
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[i+1].position;			
		}
		
		res += p1.x*(p2.z - p3.z);
	}
	
	
	res = res / 2;
	res = Math.round(res * 10) / 10;
	
	return res;
}





 






function fname_s_048( obj ) 
{
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	
	
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	pos.y = 1;
	
	var ray = new THREE.Raycaster();
	ray.set( pos, new THREE.Vector3(0, -1, 0) );
	
	var intersects = ray.intersectObjects( room, true );	
	
	var floor = (intersects.length == 0) ? null : intersects[0].object;				
	
	return { id : (floor) ? floor.userData.id : 0, obj : floor };
}



 



function fname_s_049(point) 
{
	var obj = point.userData.point.cross;
	
	if(!obj) return;
	
	if(point.userData.point.type == 'create_wall')
	{ 
		if(obj.userData.tag == 'planeMath') { fname_s_060( point ); } 
		else if(obj.userData.tag == 'point') { fname_s_057( point ); }
		else if(obj.userData.tag == 'wall') { fname_s_059( obj, point ); } 
	}
	else if(point.userData.point.type == 'continue_create_wall') 
	{ 
		if(obj.userData.tag == 'planeMath') { fname_s_057( point ); }
		else if(obj.userData.tag == 'wall') { fname_s_059( obj, point ); }
		else if(obj.userData.tag == 'point') { fname_s_057( point ); }
	}	
	else if(point.userData.point.type == 'add_point')
	{  
		if(obj.userData.tag == 'wall') { fname_s_059( obj, point ); } 
	}
	else
	{   
		if(!fname_s_051(point))
		{ 
			if(obj.userData.tag == 'planeMath') { fname_s_050(point); }
			else if(obj.userData.tag == 'point') { fname_s_057( point ); }
			else if(obj.userData.tag == 'wall') { fname_s_059( obj, point ); }	 		
		}
	}
	
	point.userData.point.cross = null;
}



function fname_s_050(point) 
{
	fname_s_0161(point.zone); 
	
	fname_s_042(param_wall.wallR);
}



function fname_s_051(point)
{
	var flag = false;
	var crossObj = point.userData.point.cross;
	
	if(crossObj.userData.tag == 'point' || crossObj.userData.tag == 'wall')
	{  
		if(point.w.length > 1)
		{
			if(Math.abs(point.position.y - crossObj.position.y) < 0.3) { flag = true; }			
		}		
	}
		
	
	if(fname_s_07(point)) { flag = true; }	
	
	
	if(flag)
	{
		fname_s_0126( point, param_wall.wallR ); 			
		
				
	}
	
	return flag;
}





function fname_s_052(point1, point2)
{
	var wall = null;
	
	for ( var i = 0; i < point1.p.length; i++ )
	{
		if(point1.p[i] == point2) { wall = point1.w[i]; break; }
	}

	return wall;
}




function fname_s_053()
{
	var wall = clickO.obj;
	clickO.obj = null;
	fname_s_0187();
	
	var pos1 = wall.userData.wall.p[0].position;
	var pos2 = wall.userData.wall.p[1].position;
	
	var pos = new THREE.Vector3().subVectors( pos2, pos1 ).divideScalar( 2 ).add(pos1); 
	var point = fname_s_0226( pos, 0 );
	
	fname_s_054( wall, point );
}



function fname_s_054( wall, point )
{	 
	clickO.move = null;					
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;																
	  
	point.userData.point.last.cdm = 'add_point';
	
	var walls = fname_s_056( wall, point );	

	point.userData.point.type = null; 

	return point;
}




function fname_s_055(wall, posx)
{
	var arrL = [], arrR = [];
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		if (v.x <= posx){ arrL[arrL.length] = wall.userData.wall.arrO[i]; }
		else { arrR[arrR.length] = wall.userData.wall.arrO[i]; }
	}	

	return { wall_1 : arrL, wall_2 : arrR };
}





function fname_s_056( wall, point )
{
	
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material; 
	var userData = wall.userData;
	var p1 = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].position.clone() };
	var p2 = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].position.clone() };
	
	 
	var arrW_2 = [];
	var point1 = wall.userData.wall.p[0];
	var point2 = wall.userData.wall.p[1];
	for ( var i = 0; i < point1.w.length; i++ ) { if(point1.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point1.w[i]; }
	for ( var i = 0; i < point2.w.length; i++ ) { if(point2.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point2.w[i]; }
	
	if(point.p.length > 0)
	{ 
		for ( var i = 0; i < point.p[0].w.length; i++ )
		{
			for ( var i2 = 0; i2 < arrW_2.length; i2++ )
			{
				if(point.p[0].w[i] == arrW_2[i2]) continue;
				
				arrW_2[arrW_2.length] = point.p[0].w[i]; break;
			}
		}		
	}
	var wallC = point.w[0];
	var point_0 = point.p[0];
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall] : fname_s_0120(wallC);
	fname_s_041( arrW );	
	
	
	wall.updateMatrixWorld();
	var ps = wall.worldToLocal( point.position.clone() );	
	var wd = fname_s_055(wall, ps.x);	

	
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point')
	{	
		var zone = fname_s_048( point.w[0] ).obj;
		var oldZ_1 = fname_s_0162(zone);
	}

	var v2 = wall.userData.wall.v;
	for ( var i2 = 0; i2 < wall.userData.wall.v.length; i2++ ) { v2[i2] = wall.userData.wall.v[i2].clone(); }

	var oldZones = fname_s_0183( wall );   	
	var oldZ = fname_s_0162( oldZones );
	fname_s_0176( oldZones );						
	
	fname_s_0151( wall, {dw : 'no delete'} );  							
	
	
	var point1 = fname_s_0242( 'point', p1.id );
	var point2 = fname_s_0242( 'point', p2.id );	
	
	if(point1 == null) { point1 = fname_s_0226( p1.pos, p1.id ); }
	if(point2 == null) { point2 = fname_s_0226( p2.pos, p2.id ); }		
	
	
	var wall_1 = fname_s_0227({ p: [point1, point], width: width, offsetZ : offsetZ, height : height });	 			
	var wall_2 = fname_s_0227({ p: [point, point2], width: width, offsetZ : offsetZ, height : height });

	
	wall_1.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];  
	wall_2.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];
	wall_1.userData.material = userData.material; 
	wall_2.userData.material = userData.material; 
	
	for ( var i = 0; i < v2.length/2; i++ ) { wall_1.userData.wall.v[i] = v2[i].clone(); wall_1.geometry.vertices[i] = v2[i].clone(); }
	
	var sub = v2[8].x - wall_2.userData.wall.v[8].x;
	for ( var i = v2.length/2; i < v2.length; i++ ) { v2[i].x -= sub; } 
	for ( var i = v2.length/2; i < v2.length; i++ ) { wall_2.userData.wall.v[i] = v2[i].clone(); wall_2.geometry.vertices[i] = v2[i].clone(); }
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall_1, wall_2] : fname_s_0120(wallC);
	
	if(point.userData.point.last.cdm == 'add_point')
	{
		fname_s_0122(point);
	}
	else
	{
		fname_s_0122(point);
		fname_s_0122(point_0);
	}
	
	fname_s_044(arrW); 	
	fname_s_042( arrW );
	
	var newZones = fname_s_0166();		
	
	
	var flag = false;
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point') { if(zone) { flag = true; } }	
	
	if(flag) { fname_s_0182(newZones, oldZ_1[0], true); } 
	else { fname_s_0180(oldZ, newZones, 'add'); }		
	
	
	
	for ( var i = 0; i < wd.wall_1.length; i++ ) 
	{ 
		var obj = wd.wall_1[i];
		
		obj.userData.door.wall = wall_1;
		wall_1.userData.wall.arrO[wall_1.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_1, wd : fname_s_039( obj ) };				
		fname_s_040( obj, objsBSP ); 		
	} 
	
	for ( var i = 0; i < wd.wall_2.length; i++ ) 
	{ 
		var obj = wd.wall_2[i];
		
		obj.userData.door.wall = wall_2;
		wall_2.userData.wall.arrO[wall_2.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_2, wd : fname_s_039( obj ) };				
		fname_s_040( obj, objsBSP ); 	
	} 	
	
	
	return [wall_1, wall_2];
}









function fname_s_057( point )
{ 	
	if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { fname_s_050(point); return; }
	
	if(point.userData.point.type == 'create_wall')			
	{		 	
		var wall = fname_s_0227({ p: [point, point.userData.point.cross] }); 		 
		point.userData.point.type = 'continue_create_wall';
		point.userData.point.cross.userData.point.last.cdm = 'new_wall_from_point';
		clickO.move = point;
		fname_s_041( point.userData.point.cross.w );	
		
	}
	else if(point.userData.point.type == 'continue_create_wall') 
	{ 
		if(point.userData.point.cross == planeMath)		
		{	
			if(fname_s_07(point)) return; 	
			
			point.userData.point.type = null; 			
			var point2 = fname_s_0226( point.position, 0 );			
			var wall = fname_s_0227({ p: [point, point2] }); 			
			clickO.move = point2;
			fname_s_044( point.p[0].w );			
			point2.userData.point.type = 'continue_create_wall'; 

			if(point.p[0].userData.point.last.cdm == 'new_point_1' || point.p[0].userData.point.last.cdm == 'new_wall_from_point')
			{
				fname_s_042( point.p[0].w );				
			}			
			
			
		} 
		else if(point.userData.point.cross.userData.tag == 'point')		
		{			
			if(point.userData.point.cross.userData.point.last.cdm == 'new_point_1' && clickO.move.userData.point.cross == point || point.userData.point.cross == point.p[0])
			{ 
				fname_s_0150(point.w[0]);
				clickO.move = null;
				clickO = resetPop.clickO();
			}						
			else
			{
				fname_s_058(point);
			}			
		}
	} 
	else if(!point.userData.point.type) 	
	{ 	
		fname_s_058(point);		
	}

	param_wall.wallR = point.w;
}


function fname_s_058(point)
{	
	if(fname_s_051(point)) { return; }		

	fname_s_041( point.userData.point.cross.w );
	
	var wall = point.w[0];
	var point1 = point.userData.point.cross;
	var point2 = point.p[0];								

	var m = point1.p.length; 
	point1.p[m] = point2;
	point1.w[m] = wall;
	point1.start[m] = point.start[0];
	
	var m = point2.p.length; 
	point2.p[m] = point1;
	point2.w[m] = wall;
	point2.start[m] = (point.start[0] == 0) ? 1 : 0;
			
	var m = (wall.userData.wall.p[0] == point) ? 0 : 1;	
	wall.userData.wall.p[m] = point1;
	
	fname_s_0156(point2, wall);			
	fname_s_0157(point);
	scene.remove(point);

	fname_s_0122(point1);
	fname_s_044( point1.w ); 

	fname_s_0181(wall);   
	
	if(!point.userData.point.type) 
	{ 
		 		
		
		if(wall.userData.wall.p[0] == point1) { var p1 = [point1, point2]; var p2 = [point, point2]; }
		else { var p1 = [point2, point1]; var p2 = [point2, point]; }							 
	} 
	else if(point.userData.point.cross.userData.tag == 'point') 
	{ 
		 
	}	
	
	var arrW = [];
	for ( var i = 0; i < point1.w.length; i++ ) { arrW[arrW.length] = point1.w[i]; }
	
	
	if(1==1)	
	{
		for ( var i = 0; i < point2.w.length; i++ ) 
		{ 
			var flag = true;
			
			for ( var i2 = 0; i2 < arrW.length; i2++ ) 
			{
				if(point2.w[i] == arrW[i2]) { flag = false; break; }
			}
			
			if(flag) arrW[arrW.length] = point2.w[i];
		}		
	}
	
	fname_s_042( arrW );
	
	clickO.move = null;
}


 






function fname_s_059( wall, point )
{ 
	if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { fname_s_050(point); return; }
	
	if(point.userData.point.type == 'add_point')			
	{    
		fname_s_054( wall, point ); 
		
	}
	else if(point.userData.point.type == 'continue_create_wall')			
	{
						 

		point.userData.point.last.cdm = 'new_point_2'; 
		
		var arrW = fname_s_056( wall, point );
		
		
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};			
		
		point.userData.point.type = null; 		
		
		clickO.move = null; 		
	}
	else if(point.userData.point.type == 'create_wall')		
	{	
		
		point.userData.point.type = null;
		point.userData.point.last.cdm = 'new_point_1'; 
		var point1 = point;		
		var point2 = fname_s_0226( point.position.clone(), 0 );			 							
		
		point2.userData.point.cross = point1;
		
		var newWall = fname_s_0227({p: [point1, point2] }); 
		var arrW = fname_s_056( wall, point1 );
		
		
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};			
		
		fname_s_041( point1.w );

		clickO.move = point2;
		point2.userData.point.type = 'continue_create_wall'; 				 
	}
	else if(!point.userData.point.type)		
	{		
		 			
		
		var p1 = point.p[0];
		var selectWall = point.w[0];
		
		point.userData.point.last.cdm = 'new_point';
		
		var arrW = fname_s_056( wall, point );		 
		
		var arrW2 = p1.w;
		
		for ( var i = 0; i < p1.w.length; i++ ) 
		{ 
			var flag = true;
			
			for ( var i2 = 0; i2 < arrW2.length; i2++ ) 
			{
				if(p1.w[i] == arrW2[i2]) { flag = false; break; }
			}
			
			if(flag) arrW2[arrW2.length] = p1.w[i];
		}
		
		fname_s_042( arrW2 );	

		
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};		  	  
		
		clickO.move = null;
	}

	param_wall.wallR = point.w;
}






function fname_s_060( point1 )
{  		
	point1.userData.point.type = null;		
	var point2 = fname_s_0226( point1.position.clone(), 0 );			
	point2.userData.point.type = 'continue_create_wall';
	
	var wall = fname_s_0227({ p: [point1, point2] });		
	
	clickO.move = point2; 
	
	param_wall.wallR = [wall];
}





 






function fname_s_061(cdm)
{
	if(!cdm) { cdm = {} };
	
	var type = (cdm.type) ? cdm.type : 'door';
	
	var color = infProject.listColor.door2D;
	
	if(type == 'window'){ color = infProject.listColor.window2D; }
	else if(type == 'door'){ color = infProject.listColor.door2D; }
	
	var material = new THREE.MeshLambertMaterial({ color: color, transparent: true, opacity: 1.0, depthTest: false, lightMap : lightMap_1 });
	
	
	if(camera == cameraTop)
	{ 
		material.depthTest = false;		
		material.opacity = 1.0; 	
	}
	else if(1 == 2)
	{ 		
		material.depthTest = true;
		material.opacity = 0;					
	}	
	
	var spline = [];			
	
	if(cdm.size)
	{
		var x = cdm.size.x/2;
		var y = cdm.size.y/2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );			
	}
	else if(type == 'window')
	{
		var x = infProject.settings.wind.width / 2;
		var y = infProject.settings.wind.height / 2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );		
	}
	else if(type == 'door')
	{  
		var x = infProject.settings.door.width / 2;
		var y = infProject.settings.door.height / 2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );		
	}
	else
	{
		return;
	}
	
	var shape = new THREE.Shape( spline );
	var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 0.2 } ), material );	
	
	var v = obj.geometry.vertices;
	
	var minX = [], maxX = [], minY = [], maxY = [], minZ = [], maxZ = [];
	
	for ( var i = 0; i < v.length; i++ )
	{
		v[i].z = Math.round(v[i].z * 100) / 100;
		if(v[i].z == 0) { minZ[minZ.length] = i; v[i].z = -0.1; }
		if(v[i].z == 0.2) { maxZ[maxZ.length] = i; v[i].z = 0.1; } 
	}
	
	obj.geometry.computeBoundingBox();	

	for ( var i = 0; i < v.length; i++ )
	{
		if(obj.geometry.boundingBox.min.x + 0.05 > v[i].x) { minX[minX.length] = i; }
		if(obj.geometry.boundingBox.max.x - 0.05 < v[i].x) { maxX[maxX.length] = i; }
		if(obj.geometry.boundingBox.min.y + 0.05 > v[i].y) { minY[minY.length] = i; }
		if(obj.geometry.boundingBox.max.y - 0.05 < v[i].y) { maxY[maxY.length] = i; }
	}
	
	
	var arr = { minX : minX, maxX : maxX, minY : minY, maxY : maxY, minZ : minZ, maxZ : maxZ };
	
	var form = { type : '' , v : arr };	
	
	obj.userData.tag = 'free_dw';
	obj.userData.door = {};
	obj.userData.door.type = type;
	obj.userData.door.size = new THREE.Vector3();
	obj.userData.door.form = form;
	obj.userData.door.bound = {}; 
	obj.userData.door.width = 0.2;
	obj.userData.door.h1 = 0;		
	obj.userData.door.color = obj.material.color; 
	obj.userData.door.wall = null;
	obj.userData.door.controll = {};
	obj.userData.door.ruler = {};
	obj.userData.door.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3(), x : 0, y : 0 };
	obj.userData.door.topMenu = true;
	obj.userData.door.lotid = (cdm.lotid)? cdm.lotid : null;
	
	
	
	
	if(1==1)
	{
		obj.geometry.computeBoundingBox();		
		var dX = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var dY = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;			
		
		obj.userData.door.form.size = new THREE.Vector3(dX, dY, 1);
		
		var h1 = (type == 'window') ? infProject.settings.wind.h1 : 0;
		 
		obj.userData.door.h1 = h1 - obj.geometry.boundingBox.min.y; 

		if(cdm.pos) { obj.userData.door.h1 = cdm.pos.y - obj.geometry.boundingBox.min.y; }
	}
		
	
	if(1==1)
	{
		var v2 = [];
		var v = obj.geometry.vertices;
		for ( var i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		obj.userData.door.form.v2 = v2;		
	}
	
	fname_s_0225( obj );
	
	scene.add( obj );
	
	
	if(cdm.status)
	{
		obj.userData.id = cdm.id;
		obj.position.copy(cdm.pos);
		
		obj.position.y += (obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y) / 2; 	
		
		fname_s_066(obj, cdm.wall);		
		fname_s_064({ obj: obj });
	}
	else
	{
		clickO.move = obj; 
		clickO.last_obj = obj;		
	}
}



function fname_s_062( event, obj ) 
{ 
	var arrDp = [];
	
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	
	for ( var i = 0; i < wall.length; i++ ){ arrDp[arrDp.length] = wall[i]; } 
	for ( var i = 0; i < window.length; i++ ){ arrDp[arrDp.length] = window[i]; } 
	for ( var i = 0; i < door.length; i++ ){ arrDp[arrDp.length] = door[i]; } 
	arrDp[arrDp.length] = planeMath; 

	var intersects = fname_s_0230( event, arrDp, 'arr' );
	
	var wall = null;
	
	var pos = new THREE.Vector3();
	obj.material.color = obj.userData.door.color;
	
	for ( var i = 0; i < intersects.length; i++ )
	{
		if (intersects[ i ].face != null) 
		{
			var object = intersects[ i ].object;
			
			if(object.userData.tag == 'planeMath'){ obj.position.copy( intersects[i].point ); } 			
			else if(object.userData.tag == 'wall')
			{ 
				wall = object; 
				obj.rotation.copy( wall.rotation ); 
				pos = intersects[i].point; 
			}
			else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); } 
		}
	}

	if(obj.material.color == new THREE.Color(infProject.listColor.active2D)) { obj.userData.door.wall = null; return; }
	if(!wall) { obj.userData.door.wall = null; return; }

	

	wall.updateMatrixWorld();			
	var pos = wall.worldToLocal( pos.clone() );	
	var pos = wall.localToWorld( new THREE.Vector3(pos.x, pos.y, 0 ) ); 	
	
	  
	if(camera == camera3D || camera == cameraWall) 
	{ 
		obj.position.set( pos.x, pos.y, pos.z ); 
	}
	else 
	{ 
		obj.position.set( pos.x, obj.userData.door.h1, pos.z ); 
	}		

	fname_s_066(obj, wall);	
}



function fname_s_063(obj)
{ 
	  
	if(obj)
	{    
		
		if(obj.userData.tag == 'free_dw') 
		{ 
			clickO.obj = obj;
			if(!obj.userData.door.wall) { return true; }
			
			clickO.last_obj = null;
			fname_s_064({ obj : obj });  
			return true; 
		}
	}

	return false;
}






function fname_s_064( cdm )
{	
	var obj = cdm.obj;
	var wall = obj.userData.door.wall;
	var pos = obj.position;
	obj.userData.tag = obj.userData.door.type;
	
	
	obj.position.copy( pos );
	obj.rotation.copy( wall.rotation ); 
	obj.material.transparent = false;
	
	
	if(camera == cameraTop)
	{ 
		obj.material.depthTest = false;
		obj.material.transparent = true;
		obj.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		obj.material.depthTest = true;
		obj.material.transparent = true;
		obj.material.opacity = 0;					
	}	
	
	
	
	
	obj.geometry.computeBoundingBox(); 	
	obj.geometry.computeBoundingSphere();
  
	
	if(!obj.userData.id) { obj.userData.id = countId; countId++; }  
	
	if(obj.userData.tag == 'window') { infProject.scene.array.window[infProject.scene.array.window.length] = obj; }
	else if(obj.userData.tag == 'door') { infProject.scene.array.door[infProject.scene.array.door.length] = obj; }

	
	
	
	obj.updateMatrixWorld();
	
	
	
	if(1==1)
	{  
		objsBSP = { wall : wall, wd : fname_s_039( obj ) };				
		fname_s_040( obj, objsBSP ); 
	}	


	wall.userData.wall.arrO[wall.userData.wall.arrO.length] = obj;
	
	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();
	
	if(obj.userData.tag == 'window') { obj.userData.door.lotid = 32; }
	else { obj.userData.door.lotid = 33; }
	
	if(obj.userData.door.lotid)
	{
		fname_s_0274({type: 'wd', wd: obj, lotid: obj.userData.door.lotid});
	}

 	
	clickO.obj = null;
	clickO.last_obj = null;
	clickO.move = null;
	
	renderCamera();
}




function fname_s_065(inf, cdm)
{
	var wd = cdm.wd;
	var objPop = inf.obj;
	
	objPop.material.visible = false;
	
	wd.add( objPop );
	
	
	fname_s_0281({obj: wd});	
	
	wd.userData.door.objPop = objPop;
	
	wd.updateMatrixWorld();
	var centerWD = wd.geometry.boundingSphere.center.clone();	

	objPop.updateMatrixWorld();
	objPop.geometry.computeBoundingBox();
	objPop.geometry.computeBoundingSphere();
	
	var center = objPop.geometry.boundingSphere.center;	
	
	objPop.position.set(0,0,0);
	objPop.rotation.set(0,0,0);
	
	

	
	if(1==1)
	{
		wd.updateMatrixWorld();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeBoundingSphere();
		var x = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
		var y = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;		
		
		objPop.geometry.computeBoundingBox();		
		var dX = objPop.geometry.boundingBox.max.x - objPop.geometry.boundingBox.min.x;
		var dY = objPop.geometry.boundingBox.max.y - objPop.geometry.boundingBox.min.y;				
		
		objPop.scale.set(x/dX, y/dY, 1);			
	}
}




function fname_s_066(obj, wall)
{
	if(obj.userData.door.wall == wall) return;
	
	
	var v = obj.geometry.vertices;
	var minZ = obj.userData.door.form.v.minZ; 
	var maxZ = obj.userData.door.form.v.maxZ;
	
	var width = wall.userData.wall.width; 
	wall.geometry.computeBoundingBox();
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z = wall.geometry.boundingBox.min.z; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z = wall.geometry.boundingBox.max.z; }
	
	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeFaceNormals();		
	
	obj.userData.door.width = width;
	obj.userData.door.wall = wall;	
} 
 


 



function fname_s_067(cdm)
{
	var event = cdm.event;
	var elem = cdm.elem;
	
	var pos = fname_s_0229(event);
	
	clickO.elem = elem;
	
	var circle = infProject.svg.furn.boxCircle.elem;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var inf = { };
	
	if(elem == circle[0])
	{
		inf.start = circle[5];
		inf.x = { o2: circle[3], o1: circle[5] };
		inf.z = { o2: circle[2], o1: circle[5] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};
	}
	else if(elem == circle[1])
	{
		inf.start = circle[4];
		inf.x = { o2: circle[0], o1: circle[3] };
		inf.z = { o2: circle[2], o1: circle[5] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[1] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[2])
	{
		inf.start = circle[3];
		inf.x = { o2: circle[0], o1: circle[3] };
		inf.z = { o2: circle[5], o1: circle[3] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[3])
	{
		inf.start = circle[2];
		inf.x = { o2: circle[0], o1: circle[2] };
		inf.z = { o2: circle[5], o1: circle[2] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[4])
	{
		inf.start = circle[1];
		inf.x = { o2: circle[3], o1: circle[0] };
		inf.z = { o2: circle[5], o1: circle[2] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[1] = {el: circle[7], p:[circle[2], circle[5]]};			
	}
	else if(elem == circle[5])
	{
		inf.start = circle[0];
		inf.x = { o2: circle[2], o1: circle[0] };
		inf.z = { o2: circle[3], o1: circle[0] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[6])
	{
		inf.start = circle[7];
		inf.x = { o2: circle[0], o1: circle[2] };
		inf.z = { o2: circle[3], o1: circle[5] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};		
	}
	else if(elem == circle[7])
	{
		inf.start = circle[6];
		inf.x = { o2: circle[2], o1: circle[0] };
		inf.z = { o2: circle[5], o1: circle[3] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};		
	}
	

	
	
	
	elem.userData.svg.circle.inf = {x: {}, z: {}, start: {}};
	
	elem.userData.svg.circle.inf.start.el = inf.start;
	elem.userData.svg.circle.inf.start.dir = new THREE.Vector2(elem.cx.baseVal.value - inf.start.cx.baseVal.value, elem.cy.baseVal.value - inf.start.cy.baseVal.value).normalize();
	
	elem.userData.svg.circle.inf.x.el = inf.x.o2;
	elem.userData.svg.circle.inf.x.dir = new THREE.Vector2(inf.x.o2.cx.baseVal.value - inf.x.o1.cx.baseVal.value, inf.x.o2.cy.baseVal.value - inf.x.o1.cy.baseVal.value).normalize();
	
	elem.userData.svg.circle.inf.z.el = inf.z.o2;
	elem.userData.svg.circle.inf.z.dir = new THREE.Vector2(inf.z.o2.cx.baseVal.value - inf.z.o1.cx.baseVal.value, inf.z.o2.cy.baseVal.value - inf.z.o1.cy.baseVal.value).normalize();

	elem.userData.svg.circle.inf.half = inf.half;
}





function fname_s_068(e)
{
	var elem = clickO.elem;
	var pos = fname_s_0229(e);
	
	var inf = elem.userData.svg.circle.inf;
	
	
	if(1==1)
	{
		var el = inf.start.el;
		var dir = inf.start.dir; 		
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = new THREE.Vector3(pos.x, 0, pos.y);
		
		var pos = fname_s_017(A,B,C);
		
		
		
		elem.setAttributeNS(null, "cx", pos.x);
		elem.setAttributeNS(null, "cy", pos.z);						
	}

	
	if(inf.x)
	{
		var el = inf.x.el;
		var dir = inf.x.dir;
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = pos;
		
		var pos2 = fname_s_017(A,B,C);	

		el.setAttributeNS(null, "cx", pos2.x);
		el.setAttributeNS(null, "cy", pos2.z);
	}

	
	if(inf.z)
	{
		var el = inf.z.el;
		var dir = inf.z.dir;
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = pos;
		
		var pos2 = fname_s_017(A,B,C);	

		el.setAttributeNS(null, "cx", pos2.x);
		el.setAttributeNS(null, "cy", pos2.z);
	}

	
	if(inf.half)
	{
		for ( var i = 0; i < inf.half.length; i++ )
		{
			var el = inf.half[i].el;
			
			var A = new THREE.Vector2(inf.half[i].p[0].cx.baseVal.value, inf.half[i].p[0].cy.baseVal.value);
			var B = new THREE.Vector2(inf.half[i].p[1].cx.baseVal.value, inf.half[i].p[1].cy.baseVal.value);
			
			var pos2 = new THREE.Vector2().subVectors( B, A ).divideScalar( 2 ).add(A);
			
			el.setAttributeNS(null, "cx", pos2.x);
			el.setAttributeNS(null, "cy", pos2.y);			
		}
	}
	
	
	
	{
		var circle = infProject.svg.furn.boxCircle.elem;	

		var x = ( ( circle[2].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( circle[2].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var A = new THREE.Vector3(x, y, -1);
		
		var x = ( ( circle[3].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( circle[3].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var B = new THREE.Vector3(x, y, -1);
		
		var x = ( ( circle[5].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( circle[5].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var C = new THREE.Vector3(x, y, -1);	
		
		
		A.unproject(camera);
		B.unproject(camera);
		C.unproject(camera);
		
		var z = A.distanceTo( C );
		var x = B.distanceTo( C );
		
		
		var obj = clickO.last_obj;		
		obj.scale.x = x/obj.userData.obj3D.box.x;
		obj.scale.z = z/obj.userData.obj3D.box.z;		
	}
	
	
	
	{
		var posCenter = new THREE.Vector3().subVectors( B, A ).divideScalar( 2 ).add(A);
		
		obj.position.x = posCenter.x;
		obj.position.z = posCenter.z;			
	}
	
	
	
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	infProject.tools.pivot.position.copy(pos);
	infProject.tools.gizmo.position.copy(pos);
	
	fname_s_070({obj: obj});
	
	e.stopPropagation();	
}





function fname_s_069() 
{
	var obj = clickO.last_obj;
	
	if(!obj) return;
	
	fname_s_070({obj: obj, boxCircle: true});
	
	clickO.elem = null;
}






function fname_s_070(cdm)
{
	
	
	var obj = cdm.obj;
		
	
	if(cdm.resetPos)
	{
		infProject.calc.boxScale2D.pos2D = null;
		infProject.calc.boxScale2D.pos3D = null;		
	}
	
	if(cdm.setPos && 1==2)
	{
		fname_s_071(cdm);
		
		return;
	}

	obj.updateMatrixWorld();
	obj.geometry.computeBoundingBox();	
	
	
	
	{
		var x1 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.max.z - 0.06) );
		var x2 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.max.z - 0.06) );
		var z1 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x + 0.06, 0, obj.geometry.boundingBox.min.z) );
		var z2 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x + 0.06, 0, obj.geometry.boundingBox.max.z) );
		
		
		var sizeX = x1.distanceTo( x2 );
		var sizeZ = z1.distanceTo( z2 );
		
		fname_s_0324({el: infProject.svg.furn.size.elem[0], point: [x1, x2]});
		fname_s_0324({el: infProject.svg.furn.size.elem[1], point: [z1, z2]});
		

		var html = infProject.html.furn.size;
		
		if(infProject.svg.furn.size.show && camera == cameraTop)
		{
			fname_s_0331(html);
			fname_s_0328(infProject.svg.furn.size.elem);
		}
		
		var posLabel = new THREE.Vector3().subVectors( x2, x1 ).divideScalar( 2 ).add(x1); 
		html[0].userData.elem.pos = posLabel;	
		html[0].style.transform = 'translate(-50%, -50%)';
		html[0].textContent = Math.round(sizeX * 100) / 100 + '';		
		fname_s_0211({elem: html[0]});

		var posLabel = new THREE.Vector3().subVectors( z2, z1 ).divideScalar( 2 ).add(z1); 
		html[1].userData.elem.pos = posLabel;	
		html[1].style.transform = 'translate(-50%, -50%)';
		html[1].textContent = Math.round(sizeZ * 100) / 100 + '';		
		fname_s_0211({elem: html[1]});		
	}
	
	
	
	{
		var v = [];
		v[0] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.max.z) );	
		v[1] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.max.z) );	
		v[2] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.min.z) );	
		v[3] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.min.z) );	
		
		var box1 = infProject.svg.furn.box1;
		
		fname_s_0326({el: box1, arrP: [v[0], v[1], v[3], v[2], v[0]]});
		
		if(camera == cameraTop) { fname_s_0328([box1]); }			
	}
	
	
	
	
	if(cdm.boxCircle)
	{
		var circle = infProject.svg.furn.boxCircle.elem;
		
		
		
		
		
		
		
		
		
		
		
		
		
		fname_s_0325({el: circle[0], pos: v[2]});
		fname_s_0325({el: circle[1], pos: new THREE.Vector3().subVectors( v[3], v[2] ).divideScalar( 2 ).add(v[2])});
		fname_s_0325({el: circle[2], pos: v[3]});
		
		
		fname_s_0325({el: circle[3], pos: v[0]});
		fname_s_0325({el: circle[4], pos: new THREE.Vector3().subVectors( v[1], v[0] ).divideScalar( 2 ).add(v[0])});
		fname_s_0325({el: circle[5], pos: v[1]});		
		
		
		fname_s_0325({el: circle[6], pos: new THREE.Vector3().subVectors( v[2], v[0] ).divideScalar( 2 ).add(v[0])});
		
		
		fname_s_0325({el: circle[7], pos: new THREE.Vector3().subVectors( v[3], v[1] ).divideScalar( 2 ).add(v[1])});
		
		if(infProject.svg.furn.boxCircle.show && camera == cameraTop) { fname_s_0328(circle); }		
	}	


	
	
	{
		var bound = { min : { x : 999999, z : 999999 }, max : { x : -999999, z : -999999 } };
		
		for(var i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}			
		
		
		var box2 = infProject.svg.furn.box2;
		
		var p1 = new THREE.Vector3(bound.min.x, 0, bound.min.z);	
		var p2 = new THREE.Vector3(bound.max.x, 0, bound.min.z);	
		var p3 = new THREE.Vector3(bound.max.x, 0, bound.max.z);	
		var p4 = new THREE.Vector3(bound.min.x, 0, bound.max.z);	
		
		
		fname_s_0326({el: box2, arrP: [p1, p2, p3, p4, p1]});
		
		if(camera == cameraTop) { fname_s_0328([box2]); }		
	}
	
	
	
	{
		var floor = null;
		
		for ( var i = 0; i < infProject.scene.array.floor.length; i++ )
		{
			var ray = new THREE.Raycaster();
			ray.set( new THREE.Vector3(obj.position.x, 1, obj.position.z), new THREE.Vector3(0, -1, 0) );
			
			var intersects = ray.intersectObject( infProject.scene.array.floor[i] );	
			
			if(intersects[0]) { floor = intersects[0].object; break; }							
		}
		
	
		
		if(floor)
		{	
			if(cdm.getObjRoom)
			{
				var arrO = fname_s_072({ignoreObj: obj, floor: floor});		
				infProject.calc.boxScale2D.arrO = arrO;				
			}
			else
			{
				var arrO = infProject.calc.boxScale2D.arrO;
			}
			
			var arrN = [];
			
			var p1 = new THREE.Vector3(bound.min.x, 0, bound.min.z);	
			var p2 = new THREE.Vector3(bound.max.x, 0, bound.min.z);	
			var p3 = new THREE.Vector3(bound.max.x, 0, bound.max.z);	
			var p4 = new THREE.Vector3(bound.min.x, 0, bound.max.z);	

			
			var posTop = new THREE.Vector3().subVectors( p2, p1 ).divideScalar( 2 ).add(p1); 
			var posBottom = new THREE.Vector3().subVectors( p3, p4 ).divideScalar( 2 ).add(p4);
			var posLeft = new THREE.Vector3().subVectors( p1, p4 ).divideScalar( 2 ).add(p4);
			var posRight = new THREE.Vector3().subVectors( p2, p3 ).divideScalar( 2 ).add(p3);
			
			var offsetLine = infProject.svg.furn.offset.elem;
			var offsetLabel = infProject.html.furn.offset;
			
			var contour = floor.userData.room.contour;
			
			var arr = [];
			
			arr[0] = {line: offsetLine[0], posStart: posTop, dir: new THREE.Vector3(0,0,-1), html: offsetLabel[0]};
			arr[1] = {line: offsetLine[1], posStart: posBottom, dir: new THREE.Vector3(0,0,1), html: offsetLabel[1]};
			arr[2] = {line: offsetLine[2], posStart: posLeft, dir: new THREE.Vector3(-1,0,0), html: offsetLabel[2]};
			arr[3] = {line: offsetLine[3], posStart: posRight, dir: new THREE.Vector3(1,0,0), html: offsetLabel[3]};
			
			var pos3 = new THREE.Vector3();
			
			for ( var n = 0; n < arr.length; n++ )
			{
				
				var dir = arr[n].dir;
				var posStart = arr[n].posStart;
				var line = arr[n].line;
				var html = arr[n].html;
				
				fname_s_0329([line]);
				fname_s_0332([html]);
				
				
				var min = 9999999;
				var pos2 = null;
				var posIntr = null;
				
				for ( var i = 0; i < contour.length; i++ )
				{
					var i2 = (contour.length - 1 == i) ? 0 : i+1;

					
					var res = fname_s_010(posStart, posStart.clone().add(dir), contour[i], contour[i2]);								
					
					if(!res[1])	
					{
						var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, 0.1) );
						
						
						if(fname_s_013(posStart, posEnd, contour[i], contour[i2])) 
						{	
							var dist = res[0].distanceTo(posStart);
							
							if(min > dist)
							{
								pos2 = res[0];
								
								min = dist;
							}
						}
					}				
				}
				
				
				
				if(!pos2)
				{
					for ( var i = 0; i < contour.length; i++ )
					{
						var i2 = (contour.length - 1 == i) ? 0 : i+1;

						
						var res = fname_s_010(posStart, posStart.clone().add(dir), contour[i], contour[i2]);								
						
						if(!res[1])	
						{
							var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, -0.1) );
							
							
							if(fname_s_013(posStart, posEnd, contour[i], contour[i2])) 
							{	
								var dist = res[0].distanceTo(posStart);
								
								if(min > dist)
								{
									pos2 = res[0];
									
									min = dist;
								}
							}
						}				
					}

				}
				
				
				for ( var i = 0; i < arrO.length; i++ )
				{
					var v = arrO[i].v;
					
					for ( var i2 = 0; i2 < v.length; i2++ )
					{
						var i3 = (v.length - 1 == i2) ? 0 : i2+1;
						
						
						
						var res = fname_s_010(posStart, posStart.clone().add(dir), v[i2], v[i3]);								
						
						if(!res[1])	
						{
							var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, 0.1) );
	
							
							if(fname_s_013(posStart, posEnd, v[i2], v[i3])) 
							{	
								var dist = res[0].distanceTo(posStart);
								
								if(min > dist)
								{
									pos2 = res[0];
									
									min = dist;
								}
							}
						}				
						
					}
				}


				
				if(pos2)
				{
					
					fname_s_0324({el: line, point: [posStart, pos2]});
					
					if(infProject.svg.furn.offset.show && camera == cameraTop)
					{
						fname_s_0328([line]);					
						fname_s_0331([html]);
					}
					
					var posLabel = new THREE.Vector3().subVectors( pos2, posStart ).divideScalar( 2 ).add(posStart); 
					html.userData.elem.pos = posLabel;					
					
					var dist = pos2.distanceTo(posStart);
					html.style.transform = 'translate(-50%, -50%)';
					html.textContent = Math.round(dist * 100) / 100 + '';
					
					fname_s_0211({elem: html});
					
					
					
					if(dist < 0.1)
					{   
						pos3.add(pos2.clone().sub(posStart));
						arrN[arrN.length] = n;						
					}
					
				}
			}
			
			
			if(arrN.length > 0)
			{ 
					
				for ( var j = 0; j < arrN.length; j++ )
				{
					var num = arrN[j]; 
					
					
					var x1 = 0;
					var y1 = 0;
					
					var offsetLine = infProject.svg.furn.offset.elem;
		
					if(num==0 || num==1) 
					{
						var y1 = offsetLine[num].y2.baseVal.value - offsetLine[num].y1.baseVal.value;
						
						offsetLine[0].y1.baseVal.value += y1;
						offsetLine[1].y1.baseVal.value += y1;
						
						offsetLine[2].y1.baseVal.value += y1;
						offsetLine[2].y2.baseVal.value += y1;

						offsetLine[3].y1.baseVal.value += y1;
						offsetLine[3].y2.baseVal.value += y1;							
					}						
					else if(num==2 || num==3) 
					{
						var x1 = offsetLine[num].x2.baseVal.value - offsetLine[num].x1.baseVal.value;
						
						offsetLine[0].x1.baseVal.value += x1;
						offsetLine[0].x2.baseVal.value += x1;
						
						offsetLine[1].x1.baseVal.value += x1;
						offsetLine[1].x2.baseVal.value += x1;							

						offsetLine[2].x1.baseVal.value += x1;
						offsetLine[3].x1.baseVal.value += x1;
					}
					
					var lineSize = infProject.svg.furn.size.elem;
					lineSize[0].x1.baseVal.value += x1;
					lineSize[0].y1.baseVal.value += y1;					
					lineSize[0].x2.baseVal.value += x1;
					lineSize[0].y2.baseVal.value += y1;
					
					lineSize[1].x1.baseVal.value += x1;
					lineSize[1].y1.baseVal.value += y1;					
					lineSize[1].x2.baseVal.value += x1;
					lineSize[1].y2.baseVal.value += y1;					
						
					var circle = infProject.svg.furn.boxCircle.elem;
					
					for ( var i = 0; i < circle.length; i++ )
					{
						circle[i].cx.baseVal.value += x1;
						circle[i].cy.baseVal.value += y1;
					}					
					
					var box1 = infProject.svg.furn.box1;
					
					var path = 'M';
					for ( var i = 0; i < box1.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box1.userData.svg.path.arrS[i];
						
						path += (arrS.x + x1)+' '+(arrS.y + y1)+',';
						
						arrS.x += x1;
						arrS.y += y1;
					}

					box1.setAttribute("d", path);
					
					
					var box2 = infProject.svg.furn.box2;
					
					var path = 'M';
					for ( var i = 0; i < box2.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box2.userData.svg.path.arrS[i];
						
						path += (arrS.x + x1)+' '+(arrS.y + y1)+', ';
						
						arrS.x += x1;
						arrS.y += y1;
					}

					box2.setAttribute("d", path);						
				}
				
				
				
				{
					fname_s_0327({el: infProject.svg.furn.size.elem});
					
					var sizeLine = infProject.svg.furn.size.elem;
					var sizeLabel = infProject.html.furn.size;					
					
					for ( var i = 0; i < sizeLabel.length; i++ )
					{
						var p = sizeLine[i].userData.svg.line.p;
						
						var posLabel = new THREE.Vector3().subVectors( p[1], p[0] ).divideScalar( 2 ).add(p[0]); 
						sizeLabel[i].userData.elem.pos = posLabel;					
						
						var dist = p[0].distanceTo(p[1]);
						sizeLabel[i].style.transform = 'translate(-50%, -50%)';
						sizeLabel[i].textContent = Math.round(dist * 100) / 100 + '';
						
						fname_s_0211({elem: sizeLabel[i]});

						if(dist < 0.01)
						{
							fname_s_0332([sizeLabel[i]]);
						}
					}									
				}
				
				
				
				{
					fname_s_0327({el: infProject.svg.furn.offset.elem});
					
					var offsetLine = infProject.svg.furn.offset.elem;
					var offsetLabel = infProject.html.furn.offset;
					
					for ( var i = 0; i < offsetLabel.length; i++ )
					{
						var p = offsetLine[i].userData.svg.line.p;
						
						var posLabel = new THREE.Vector3().subVectors( p[1], p[0] ).divideScalar( 2 ).add(p[0]); 
						offsetLabel[i].userData.elem.pos = posLabel;					
						
						var dist = p[0].distanceTo(p[1]);
						offsetLabel[i].style.transform = 'translate(-50%, -50%)';
						offsetLabel[i].textContent = Math.round(dist * 100) / 100 + '';
						
						fname_s_0211({elem: offsetLabel[i]});

						if(dist < 0.01)
						{
							fname_s_0332([offsetLabel[i]]);
						}
					}
				}
				
				
				{
					
					
					obj.position.x += pos3.x;
					obj.position.z += pos3.z;
		

					infProject.tools.pivot.position.x += pos3.x;
					infProject.tools.pivot.position.z += pos3.z;					
					infProject.tools.gizmo.position.x += pos3.x;
					infProject.tools.gizmo.position.z += pos3.z;
				}
				
			}							
		}
		else
		{
			fname_s_0329(infProject.svg.furn.offset.elem);
			fname_s_0332(infProject.html.furn.offset);
		}
		
	}
}




function fname_s_071(cdm)
{
	var offset_2D = new THREE.Vector2();
	var offset_3D = new THREE.Vector3();
	
	if(infProject.calc.boxScale2D.pos2D)
	{
		offset_2D = new THREE.Vector2().subVectors( cdm.setPos.pos2D, infProject.calc.boxScale2D.pos2D );
		offset_3D = new THREE.Vector3().subVectors( cdm.setPos.pos3D, infProject.calc.boxScale2D.pos3D );
	}
	
	infProject.calc.boxScale2D.pos2D = cdm.setPos.pos2D;
	infProject.calc.boxScale2D.pos3D = cdm.setPos.pos3D;
			
	
	{					
		var x1 = offset_2D.x;
		var y1 = offset_2D.y;
		
		
		
		var offsetLine = infProject.svg.furn.offset.elem;

		for ( var i = 0; i < offsetLine.length; i++ )
		{
			offsetLine[i].x1.baseVal.value += x1;
			offsetLine[i].x2.baseVal.value += x1;				
			offsetLine[i].y1.baseVal.value += y1;
			offsetLine[i].y2.baseVal.value += y1;						
		}

		
		var lineSize = infProject.svg.furn.size.elem;
		
		for ( var i = 0; i < lineSize.length; i++ )
		{
			lineSize[i].x1.baseVal.value += x1;
			lineSize[i].y1.baseVal.value += y1;					
			lineSize[i].x2.baseVal.value += x1;
			lineSize[i].y2.baseVal.value += y1;				
		}							
			
		var circle = infProject.svg.furn.boxCircle.elem;
		
		for ( var i = 0; i < circle.length; i++ )
		{
			circle[i].cx.baseVal.value += x1;
			circle[i].cy.baseVal.value += y1;
		}
		
		var box1 = infProject.svg.furn.box1;
		
		for ( var i = 0; i < box1.pathSegList.length; i++ )
		{
			box1.pathSegList[i].x += x1;
			box1.pathSegList[i].y += y1;
		}						
		
		var box2 = infProject.svg.furn.box2;
		
		for ( var i = 0; i < box2.pathSegList.length; i++ )
		{
			box2.pathSegList[i].x += x1;
			box2.pathSegList[i].y += y1;
		}


		var offsetLabel = infProject.html.furn.offset;			
		
		for ( var i = 0; i < offsetLabel.length; i++ )
		{
			offsetLabel[i].style.left = offsetLabel[i].offsetLeft + x1 + "px";
			offsetLabel[i].style.top = offsetLabel[i].offsetTop + y1 + "px";
		}

		var sizeLabel = infProject.html.furn.size;			
		
		for ( var i = 0; i < sizeLabel.length; i++ )
		{
			sizeLabel[i].style.left = sizeLabel[i].offsetLeft + x1 + "px";
			sizeLabel[i].style.top = sizeLabel[i].offsetTop + y1 + "px";
		}			
	}		
	
}




function fname_s_072(cdm)
{
	
	
	var arr = [];	
	
	var floor = cdm.floor;		
	var obj = (cdm.ignoreObj) ? cdm.ignoreObj : null;	

	
	for ( var i = 0; i < infProject.scene.array.obj.length; i++ )
	{				
		var obj_2 = infProject.scene.array.obj[i];
		
		if(obj_2 == obj) continue;
		
		var ray = new THREE.Raycaster();
		ray.set( new THREE.Vector3(obj_2.position.x, 1, obj_2.position.z), new THREE.Vector3(0, -1, 0) );
		
		var intersects = ray.intersectObject( floor );	
		
		if(intersects[0]) 
		{
			
			{
				var v = [];
				v[0] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.min.x, 0, obj_2.geometry.boundingBox.max.z) );	
				v[1] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.max.x, 0, obj_2.geometry.boundingBox.max.z) );	
				
				v[2] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.max.x, 0, obj_2.geometry.boundingBox.min.z) );	
				v[3] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.min.x, 0, obj_2.geometry.boundingBox.min.z) );	
			}

			arr[arr.length] = { o: obj_2, v: v };
		}					
	}


	return arr;
}






var isMouseDown1 = false;
var isMouseRight1 = false;
var isMouseDown2 = false;
var isMouseDown3 = false;
var onMouseDownPosition = new THREE.Vector2();
var long_click = false;
var lastClickTime = 0;
var catchTime = 0.30;
var vk_click = '';





function fname_s_073()
{
	
	clickO.buttonAct = null;
	clickO.button = null; 
	
	var obj = clickO.move;
	
	if(obj)
	{
		if(obj.userData.tag == 'free_dw') { scene.remove(obj); }
		
		if(obj.userData.tag == 'point') 
		{ 	
			if(obj.w.length == 0){ fname_s_0152(obj); }  
			else 
			{ 
				if(obj.userData.point.type == 'continue_create_wall')
				{
					var point = obj.p[0]; 
					fname_s_0150(obj.w[0]); 
					
				}
				
				if(point.userData.point.last.cdm == 'new_point_1') { fname_s_0153( point ).wall.userData.id = point.userData.point.last.cross.walls.old; }
			}
		}
		else if(obj.userData.tag == 'obj')
		{
			fname_s_0260({obj: obj}); 
		}		

		clickO = resetPop.clickO();
	}	
	
	clickO.move = null;	
}



function fname_s_074( event ) 
{
	

	if (window.location.hostname == 'vm'){} 
	else if (window.location.hostname == 'remstok'){} 
	else if (window.location.hostname == 'remstok.ru'){}
	else if (window.location.hostname == 'vim'){}
	else if (window.location.hostname == 'vim.myplan.pro'){} 
	else if (window.location.hostname == 'tt1'){}
	else if (window.location.hostname == 'localtest.vim.myplan.pro'){}
	else if (window.location.hostname == '2d.myplan.pro'){}
	else { return; }
 
	long_click = false;
	lastClickTime = new Date().getTime();

	if(fname_s_0335(event)) { return; }		
	
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		vk_click = 'left';
	}	

	switch ( event.button ) 
	{
		case 0: vk_click = 'left'; break;
		case 1: vk_click = 'right';  break;
		case 2: vk_click = 'right'; break;
	}


	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;

	fname_s_091( event, vk_click );
	fname_s_092( event, vk_click );


	if ( vk_click == 'right' ) { fname_s_073( event ); return; } 


	if(clickO.move)
	{
		if(clickO.move.userData.tag == 'point') 
		{			
			if(clickO.move.userData.point.type) { fname_s_049( clickO.move ); return; }  
		}
	}
	 
	clickO.obj = null; 	
	clickO.actMove = false;	
	clickO.selectBox.drag = false;
	clickO.rayhit = fname_s_075(event); 
	
	fname_s_076({type: 'down'});
	
	renderCamera();
}





function fname_s_075(event)
{ 
	var rayhit = null;	
				
	
	if(infProject.tools.pivot.visible)
	{
		var ray = fname_s_0230( event, infProject.tools.pivot.children, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}
	
	if(infProject.tools.gizmo.visible)
	{
		var arr = [];
		for ( var i = 0; i < infProject.tools.gizmo.children.length; i++ ){ arr[i] = infProject.tools.gizmo.children[i]; }
		
		var ray = fname_s_0230( event, arr, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}

	if(!infProject.scene.block.click.controll_wd)
	{
		var ray = fname_s_0230( event, infProject.tools.controllWD, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.door)
	{
		var ray = fname_s_0230( event, infProject.scene.array.door, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.window)
	{
		var ray = fname_s_0230( event, infProject.scene.array.window, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.point)
	{
		var ray = fname_s_0230( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	if(!infProject.scene.block.click.wall)
	{
		var arr = [];
		for ( var i = 0; i < infProject.scene.array.wall.length; i++ )
		{ 
			if(!infProject.scene.array.wall[i].userData.wall.show) continue;
			arr[arr.length] = infProject.scene.array.wall[i]; 
		}		
		
		var ray = fname_s_0230( event, arr, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	
	if(!infProject.scene.block.click.obj)
	{
		var ray = fname_s_0230( event, infProject.scene.array.obj, 'arr' );
		
		if(ray.length > 0)
		{   
			if(rayhit)
			{  
				if(rayhit.distance > ray[0].distance) { rayhit = ray[0]; }				
			}
			else 
			{
				rayhit = ray[0];
			}
		}			
	}
	
	if(!rayhit)
	{
		var ray = fname_s_0230( event, infProject.scene.array.floor, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; }			
	}	
	
	
	return rayhit;
}


function fname_s_076(cdm)
{
	if(!clickO.rayhit) { fname_s_079(cdm); return; }

	var obj = clickO.obj = clickO.rayhit.object;
	fname_s_079(cdm);
	
	var tag = obj.userData.tag;
	var rayhit = clickO.rayhit;
	var flag = true;
	
	if(cdm.type == 'down')
	{  
		if(fname_s_063(clickO.move)) { flag = false; }
		else if( tag == 'pivot' ) { fname_s_0252( rayhit ); }
		else if( tag == 'gizmo' ) { fname_s_0266( rayhit ); } 
		else if( tag == 'wall' && camera == cameraTop ) { fname_s_0128( rayhit ); }
		else if( tag == 'point' ) { fname_s_0111( rayhit ); }
		else if( tag == 'window' ) { fname_s_0138( rayhit ); }
		else if( tag == 'door' ) { fname_s_0138( rayhit ); }
		else if( tag == 'controll_wd' ) { fname_s_0107( rayhit ); }
		else if( tag == 'obj' && camera == cameraTop ) { fname_s_0256({obj: obj, rayhit: rayhit}); }
		else if( tag == 'obj' && camera == camera3D && infProject.tools.pivot.userData.pivot.obj == obj) { fname_s_0256({obj: obj, rayhit: rayhit}); }
		else { flag = false; }
	}
	else if(cdm.type == 'up')
	{	
		if( tag == 'wall' && camera == camera3D ) { fname_s_0129({obj: obj, rayhit: rayhit}); }
		else if( tag == 'obj' && camera == camera3D && infProject.tools.pivot.userData.pivot.obj !== obj ) { fname_s_0256({obj: obj, rayhit: rayhit}); }
		else if( tag == 'room' && camera == cameraTop ) { fname_s_0165({obj: obj}); }
		else if( tag == 'room' && camera == camera3D ) { fname_s_0165({obj: obj}); }
		else { flag = false; }
	}	

	
	if(flag) 
	{
		if(camera == cameraTop)
		{
			fname_s_0186(obj);
		}		

		if(tag == 'pivot') { obj = infProject.tools.pivot.userData.pivot.obj; }
		else if(tag == 'gizmo') { obj = infProject.tools.gizmo.userData.gizmo.obj; }		
		
		clickO.last_obj = obj;
		
		fname_s_081( obj );
	}
}


function fname_s_077( event ) 
{ 
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		isMouseDown2 = true;
	}
	
	if(fname_s_0336(event)) { return; }		
	
	if(clickO.elem) { fname_s_068(event); }

	fname_s_0232( event );
		

	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }

	var obj = clickO.move;
	
	if ( obj ) 
	{
		var tag = obj.userData.tag;
			
		if ( tag == 'pivot' ) { fname_s_0253( event ); }
		else if ( tag == 'gizmo' ) { fname_s_0268( event ); }
		else if ( tag == 'wall' ) { fname_s_0132( event, obj ); }
		else if ( tag == 'window' ) { fname_s_0142( event, obj ); }
		else if ( tag == 'door' ) { fname_s_0142( event, obj ); }
		else if ( tag == 'controll_wd' ) { fname_s_0108( event, obj ); }
		else if ( tag == 'point' ) { fname_s_0113( event, obj ); }
		else if ( tag == 'room' ) { fname_s_090( event ); }		
		else if ( tag == 'free_dw' ) { fname_s_062( event, obj ); }
		else if ( tag == 'obj' ) { fname_s_0258( event ); }
		else if ( tag == 'obj_spot' ) { fname_s_0258( event ); }
	}
	else if(camera == cameraTop && clickO.selectBox.drag) 
	{		
		fname_s_0341(event); 
	}	
	else 
	{
		if ( camera == camera3D ) { fname_s_090( event ); }
		else if ( camera == cameraTop ) { fname_s_093( event ); }
		else if ( camera == cameraWall ) { fname_s_094( event ); }
	}
	
	fname_s_0184( event );

	renderCamera();
}


function fname_s_078( event )  
{

	if(fname_s_0337(event)) { return; }		
	
	if(!long_click) 
	{ 
		fname_s_076({type: 'up'}); 
	}	
	
	var obj = clickO.move;		
	
	
	if(clickO.elem)
	{
		fname_s_069();
	}
	
	if(obj)  
	{
		var tag = obj.userData.tag;
		
		if(tag == 'point') 
		{  		
			var point = clickO.move;
			fname_s_0127(point); 
			if(!clickO.move.userData.point.type) { fname_s_049(clickO.move); }						
		}
		else if(tag == 'wall') { fname_s_0137(obj); }
		else if(tag == 'window' || obj.userData.tag == 'door') { fname_s_0147(obj); }	
		else if(tag == 'controll_wd') { fname_s_0110(obj); } 
		else if(tag == 'obj') { fname_s_0259(obj); }
		else if(tag == 'pivot') { fname_s_0255(); }
		else if(tag == 'gizmo') { fname_s_0270(); }
		
		if(tag == 'free_dw') {  }
		else if (tag == 'point') 
		{
			if(obj.userData.point.type) {  } 
			else { clickO.move = null; }
		}		
		else { clickO.move = null; }		
	}
	else if(clickO.selectBox.drag)
	{		
		fname_s_0342();
	}	
	
	
	param_win.click = false;
	isMouseDown1 = false;
	isMouseRight1 = false;
	isMouseDown2 = false;
	isMouseDown3 = false;
	clickO.elem = null;
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	
	
	clickO.offset = new THREE.Vector3();
	
	renderCamera();
}





function fname_s_079(cdm)
{
	if(fname_s_0343(clickO.obj)) { return; }
	
	var obj = clickO.last_obj;
	if(!cdm) { cdm = {type: ''}; }
	
	var flag = true;
	
	if(obj)
	{ 
		fname_s_0187(); 
		

		var tag = obj.userData.tag;
		
		if(cdm.type == 'down')
		{
			if(tag == 'wall' && camera == cameraTop) { fname_s_080(obj); }
			else if(tag == 'point' && camera == cameraTop) { fname_s_080(obj); }
			else if(tag == 'window' && camera == cameraTop) { fname_s_0144(obj); fname_s_080(obj); }
			else if(tag == 'door' && camera == cameraTop) { fname_s_0144(obj); fname_s_080(obj); }
			else if(tag == 'obj' && camera == cameraTop) { fname_s_0261(obj); }			
			else { flag = false; }
		}
		else if(cdm.type == 'up')
		{
			if(tag == 'wall' && camera == camera3D) { fname_s_080(obj); fname_s_0208(); }
			else if(tag == 'room' && camera == cameraTop) { fname_s_080(obj); fname_s_0208(); }
			else if(tag == 'room' && camera == camera3D) { fname_s_080(obj); fname_s_0208(); }
			else if(tag == 'obj' && camera == camera3D) { fname_s_0261(obj); }
			else { flag = false; }
		}
		else
		{
			if(tag == 'wall') { fname_s_080(obj); }
			else if(tag == 'point') { fname_s_080(obj); }
			else if(tag == 'window') { fname_s_0144(obj); fname_s_080(obj); }
			else if(tag == 'door') { fname_s_0144(obj); fname_s_080(obj); }
			else if(tag == 'room') { fname_s_080(obj); }
			else if(tag == 'obj') { fname_s_0261(obj); }
			else { flag = false; }
		}
	}
	
	if(flag) clickO.last_obj = null;
}




function fname_s_080(obj) 
{
	if(!obj) return;  
	if(!obj.userData) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(tag == 'wall') { fname_s_029(); }
	else if(tag == 'point') { fname_s_029(); }
	else if(tag == 'window') { fname_s_029(); }
	else if(tag == 'door') { fname_s_029(); }
	else if(tag == 'room') { fname_s_029(); }
}





function fname_s_081( obj )
{
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if ( tag == 'room' ) 
	{
		var txt = '';
		
		for ( var i = 0; i < obj.p.length - 1; i++ ) { txt += '| ' + obj.p[i].userData.id; }
		
		
	}
	else if( tag == 'wall' )
	{ 
		
		 
	}
	else if( tag == 'point' )
	{ 
		 
	}
	else if( tag == 'window' || tag == 'door' )
	{ 
		var txt = {};		
		 
	}
	else if ( tag == 'controll_wd' ) 
	{
		
	}
	else if ( tag == 'obj' ) 
	{
		
	}		
	else 
	{
		
	}	
}



    



function fname_s_082(cam)
{  
	fname_s_0234();
	
	camera = cam;
	renderPass.camera = cam;
	outlinePass.renderCamera = cam;
	if(saoPass) saoPass.camera = cam;
	fname_s_0208();
	
	if(camera == cameraTop)
	{				
		infProject.camera.d3.targetO.visible = false;
		fname_s_087({visible_1: false, visible_2: false});
		
		fname_s_083();			
		fname_s_097( camera.zoom );

		fname_s_0289();	
		
		fname_s_028({current: true});
	}
	else if(camera == camera3D)
	{	
		infProject.camera.d3.targetO.visible = true;
		fname_s_087({visible_1: true, visible_2: true});
				 
		fname_s_097( cameraTop.zoom );
		fname_s_083();
		
		for( var i = 0; i < infProject.scene.array.cubeCam.length; i++ )
		{
			
		}		
		
		
		fname_s_0287();
		fname_s_0288();
		
		fname_s_028({current: true});
	}
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	

	clickO = resetPop.clickO();
	
	renderCamera();
}







function fname_s_083()
{
	if(camera == cameraTop)
	{
		var depthTest = false;
		var w2 = 1;
		var visible = true;
		var visible_2 = true;
	}
	else if(camera == camera3D || camera == cameraWall)
	{
		var depthTest = true;
		var w2 = 0.0;
		var visible = false;
		var visible_2 = false;
	}
	else { return; } 
	
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	
	
	
	
	var label = [];
	for ( var i = 0; i < wall.length; i++ )
	{				
		for ( var i2 = 0; i2 <  wall[i].userData.wall.html.label.length; i2++ )
		{
			label[label.length] = wall[i].userData.wall.html.label[i2];  
		}
	}		

	if(infProject.settings.floor.label.visible)
	{
		for ( var i = 0; i < floor.length; i++ )
		{ 
			if(visible)
			{
				if(floor[i].userData.room.zone.id !== undefined)
				{
					label[label.length] = floor[i].userData.room.html.label; 
				}
			}
			else
			{
				label[label.length] = floor[i].userData.room.html.label;
			}			 
		}		
	}
	
	if(visible) { fname_s_0331(label); }
	else 
	{ 
		fname_s_0332(label); 
		fname_s_0332(infProject.html.furn.size);
		fname_s_0332(infProject.html.furn.offset);		
	}

	fname_s_0329(infProject.svg.arr);
	
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		point[i].visible = visible; 
	}		

	fname_s_084(window, visible_2);
	fname_s_084(door, visible_2);
	
}



function fname_s_084(arr, visible)
{	
	if(arr.length == 0) return;
	
	for ( var i = 0; i < arr.length; i++ ) { arr[i].material.visible = visible; }				
}





function fname_s_camera3d_view(cdm)
{
	if(camera != camera3D) return;
	
	if(!cdm) { cdm = {}; }
	
	if(cdm.type)
	{
		camera3D.userData.camera.type = cdm.type;
	}
	else
	{
		if(camera3D.userData.camera.type == 'first')
		{
			camera3D.userData.camera.type = 'fly';
		}
		else
		{
			camera3D.userData.camera.type = 'first';
		}
	}

	
	var posCenter = infProject.camera.d3.targetO.position;
	
	if(camera3D.userData.camera.type == 'first')
	{		
		camera3D.userData.camera.save.pos = camera3D.position.clone();
		camera3D.userData.camera.save.radius = posCenter.distanceTo(camera.position);
		 
		camera3D.userData.camera.dist = posCenter.distanceTo(camera.position);
		camera3D.userData.camera.type = 'first';		
		
		newCameraPosition = { positionFirst: new THREE.Vector3(posCenter.x, 1.5, posCenter.z) };

		
		fname_s_0289();	
	}
	else
	{
		var radius = camera3D.userData.camera.save.radius;
		var pos = new THREE.Vector3();		
		
		var radH = Math.acos(camera3D.userData.camera.save.pos.y/radius);
		
		camera3D.updateMatrixWorld();
		var dir = camera3D.getWorldDirection(new THREE.Vector3());
		dir = new THREE.Vector3(dir.x, 0, dir.z).normalize();
		
		var radXZ = Math.atan2(dir.z, dir.x);		
	
		pos.x = -radius * Math.sin(radH) * Math.cos(radXZ) + posCenter.x; 
		pos.z = -radius * Math.sin(radH) * Math.sin(radXZ) + posCenter.z;
		pos.y = radius * Math.cos(radH);					
		
		newCameraPosition = { positionFly: pos };

		
		fname_s_0287();
		fname_s_0288();		 
	}
}





function fname_s_086()  
{ 	
	cameraWall.zoom = 2;
	camera.updateMatrixWorld();
	camera.updateProjectionMatrix();
	
	var posX = { min : arrWallFront.bounds.min.x.clone(), max : arrWallFront.bounds.max.x.clone() };
	var posY = { min : arrWallFront.bounds.min.y.clone(), max : arrWallFront.bounds.max.y.clone() };
	
	posX.min.project(camera);
	posY.min.project(camera);	
	
	
	
	var x = 0.6/posX.min.x;
	var y = 0.6/posY.min.y;
	
	camera.zoom = (posX.min.x < posY.min.y) ? Math.abs(x) * 2 : Math.abs(y) * 2;    
	
	camera.updateMatrixWorld();
	camera.updateProjectionMatrix();
}

 






function fname_s_087(cdm)
{
	var visible_1 = cdm.visible_1;
	var visible_2 = cdm.visible_2;
	
	
	

	infProject.scene.block.click.point = visible_1;
	infProject.scene.block.hover.point = visible_1;

	infProject.scene.block.click.window = visible_1;
	infProject.scene.block.hover.window = visible_1;

	infProject.scene.block.click.door = visible_1;
	infProject.scene.block.hover.door = visible_1;

	infProject.scene.block.click.room = visible_1;
	infProject.scene.block.hover.room = visible_1;

	infProject.scene.block.click.controll_wd = visible_1;
	infProject.scene.block.hover.controll_wd = visible_1;	
}






var type_browser = fname_s_0102();
var newCameraPosition = null;


function fname_s_088() 
{
	
	
	var flag = false;
	
	var keys = clickO.keys;  
	if(keys.length == 0) return;
	
	if ( camera == cameraTop )
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			camera.position.z -= 0.1;			
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			camera.position.z += 0.1;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			camera.position.x -= 0.1;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			camera.position.x += 0.1;
			flag = true;
		}
	}
	else if ( camera == camera3D ) 
	{
		var kof = (camera3D.userData.camera.type == 'fly') ? 0.1 : 0.03;
		
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( -x, 0, -z );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			camera.position.add( dir );
			
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			var x = Math.sin( camera.rotation.y - 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y - 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			var x = Math.sin( camera.rotation.y + 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y + 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
		if ( keys[ 88 ] && 1==2 ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, -kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
		else if ( keys[ 67 ] && 1==2 ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			
			flag = true;
		}
	}

	if(flag) 
	{ 
		if(camera == camera3D) 
		{ 
			infProject.camera.d3.targetO.position.add( dir );
		}			
		
		newCameraPosition = null;
		renderCamera(); 
	}
}



function fname_s_089(cdm)
{
	camera3D.position.x = 0;
	camera3D.position.y = cdm.radious * Math.sin( cdm.phi * Math.PI / 360 );
	camera3D.position.z = cdm.radious * Math.cos( cdm.theta * Math.PI / 360 ) * Math.cos( cdm.phi * Math.PI / 360 );			
			
	camera3D.lookAt(new THREE.Vector3( 0, 0, 0 ));
	
	camera3D.userData.camera.save.pos = camera3D.position.clone();
	camera3D.userData.camera.save.radius = infProject.camera.d3.targetO.position.distanceTo(camera3D.position);	
}



function fname_s_090( event )
{ 
	if ( camera3D.userData.camera.type == 'fly' )
	{
		if ( isMouseDown2 ) 
		{  
			newCameraPosition = null;
			var radious = infProject.camera.d3.targetO.position.distanceTo( camera.position );
			
			var theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + infProject.camera.d3.theta;
			var phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + infProject.camera.d3.phi;
			var phi = Math.min( 180, Math.max( 5, phi ) );

			camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera.position.add( infProject.camera.d3.targetO.position );  
			camera.lookAt( infProject.camera.d3.targetO.position );			
			
			infProject.camera.d3.targetO.rotation.set( 0, camera.rotation.y, 0 );
			
			fname_s_0288();
		}
		if ( isMouseDown3 )    
		{
			newCameraPosition = null;
			
			var intersects = fname_s_0230( event, planeMath, 'one' );
			var offset = new THREE.Vector3().subVectors( camera3D.userData.camera.click.pos, intersects[0].point );
			camera.position.add( offset );
			infProject.camera.d3.targetO.position.add( offset );
			
			fname_s_0288();
		}
	}
	else if ( camera3D.userData.camera.type == 'first' )
	{
		if ( isMouseDown2 )
		{
			newCameraPosition = null;
			var y = ( ( event.clientX - onMouseDownPosition.x ) * 0.006 );
			var x = ( ( event.clientY - onMouseDownPosition.y ) * 0.006 );

			camera.rotation.x -= x;
			camera.rotation.y -= y;
			onMouseDownPosition.x = event.clientX;
			onMouseDownPosition.y = event.clientY;
			
			infProject.camera.d3.targetO.position.set( camera.position.x, infProject.camera.d3.targetO.position.y, camera.position.z );

			infProject.camera.d3.targetO.rotation.set( 0, camera.rotation.y, 0 );
		}
	} 		
	
}




function fname_s_091( event, click )
{
	if ( camera == cameraTop || camera == cameraWall) { }
	else { return; }

	isMouseDown1 = true;
	isMouseRight1 = true;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
	newCameraPosition = null;
	

	if(camera == cameraTop) 
	{
		planeMath.position.set(camera.position.x,0,camera.position.z);
		planeMath.rotation.set(-Math.PI/2,0,0);  
		planeMath.updateMatrixWorld();
		
		var intersects = fname_s_0230( event, planeMath, 'one' );
		
		onMouseDownPosition.x = intersects[0].point.x;
		onMouseDownPosition.z = intersects[0].point.z;	 		
	}
	if(camera == cameraWall) 
	{
		var dir = camera.getWorldDirection();
		dir = new THREE.Vector3().addScaledVector(dir, 10);
		planeMath.position.copy(camera.position);  
		planeMath.position.add(dir);  
		planeMath.rotation.copy( camera.rotation ); 
		planeMath.updateMatrixWorld();

		var intersects = fname_s_0230( event, planeMath, 'one' );	
		onMouseDownPosition.x = intersects[0].point.x;
		onMouseDownPosition.y = intersects[0].point.y;
		onMouseDownPosition.z = intersects[0].point.z;		 		
	}	
}




function fname_s_092( event, click )
{
	if ( camera != camera3D ) { return; }

	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;

	if ( click == 'left' )				
	{
		
		var dir = new THREE.Vector3().subVectors( infProject.camera.d3.targetO.position, camera.position ).normalize();
		
		
		var dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; } 			
		
		
		dir.y = 0; 
		dir.normalize();    			
		
		isMouseDown2 = true;
		infProject.camera.d3.theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;
		infProject.camera.d3.phi = dergree;
	}
	else if ( click == 'right' )		
	{
		isMouseDown3 = true;
		planeMath.position.copy( infProject.camera.d3.targetO.position );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();

		var intersects = fname_s_0230( event, planeMath, 'one' );	
		camera3D.userData.camera.click.pos = intersects[0].point;  
	}
}





function fname_s_093( event ) 
{
	if(isMouseRight1 || isMouseDown1) {}
	else { return; }


	newCameraPosition = null;	
	
	var intersects = fname_s_0230( event, planeMath, 'one' );
	
	camera.position.x += onMouseDownPosition.x - intersects[0].point.x;
	camera.position.z += onMouseDownPosition.z - intersects[0].point.z;	
}



function fname_s_094( event )
{
	if ( !isMouseRight1 ) { return; }

	var intersects = fname_s_0230( event, planeMath, 'one' );
	
	camera.position.x += onMouseDownPosition.x - intersects[0].point.x;
	camera.position.y += onMouseDownPosition.y - intersects[0].point.y;	
	camera.position.z += onMouseDownPosition.z - intersects[0].point.z;
	
	newCameraPosition = null;	
}



function fname_s_095( e )
{
	
	var delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;

	if ( type_browser == 'Chrome' || type_browser == 'Opera' ) { delta = -delta; }

	if(camera == cameraTop) 
	{ 
		fname_s_097( camera.zoom - ( delta * 0.1 * ( camera.zoom / 2 ) ) ); 
	}
	else if(camera == camera3D) 
	{ 
		fname_s_098( delta, 1 ); 
	}
	
	fname_s_0254();
	
	renderCamera();
}





var zoomLoop = '';
function fname_s_096() 
{
	var flag = false;
	
	if ( camera == cameraTop )
	{
		if ( zoomLoop == 'zoomOut' ) { fname_s_097( camera.zoom - ( 0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { fname_s_097( camera.zoom - ( -0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
	}
	else if ( camera == camera3D )
	{
		if ( zoomLoop == 'zoomOut' ) { fname_s_098( 0.3, 0.3 ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { fname_s_098( -0.3, 0.3 ); flag = true; }
	}
	else if ( camera == cameraWall )
	{
		if ( zoomLoop == 'zoomOut' ) { camera.zoom = camera.zoom - ( 0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { camera.zoom = camera.zoom - ( -0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		camera.updateProjectionMatrix();
	}
	
	if(flag) { renderCamera(); }
}






function fname_s_097( delta )
{
	if(camera == cameraTop)
	{		
		camera.zoom = delta;
		camera.updateProjectionMatrix();		
	}

	
	infProject.tools.axis[0].scale.set(1,1/delta,1/delta);
	infProject.tools.axis[1].scale.set(1,1/delta,1/delta);
	
	
	var k = 1 / delta;
	if(k <= infProject.settings.camera.limitZoom && 1==2) 
	{		
		
		var point = infProject.tools.point;	
		var v = point.geometry.vertices;
		var v2 = point.userData.tool_point.v2;
			
		for ( var i = 0; i < v2.length; i++ )
		{
			v[i].x = v2[i].x * 1/delta;
			v[i].z = v2[i].z * 1/delta;
		}	

		infProject.tools.point.geometry.verticesNeedUpdate = true;
		infProject.tools.point.geometry.elementsNeedUpdate = true;


		
		for ( var i = 0; i < infProject.scene.size.wd_1.line.length; i++ ){ infProject.scene.size.wd_1.line[i].scale.set(1,1/delta,1/delta); }			
	}
}



function fname_s_098( delta, z )
{
	if ( camera != camera3D ) return;

	if(camera3D.userData.camera.type == 'fly')
	{
		var vect = ( delta < 0 ) ? z : -z;

		var pos1 = infProject.camera.d3.targetO.position;
		var pos2 = camera.position.clone();
		
		var dir = new THREE.Vector3().subVectors( pos1, camera.position ).normalize();
		dir = new THREE.Vector3().addScaledVector( dir, vect );
		dir.addScalar( 0.001 );
		var pos3 = new THREE.Vector3().addVectors( camera.position, dir );	


		var qt = fname_s_0238( new THREE.Vector3().subVectors( pos1, camera.position ).normalize() );
		var v1 = fname_s_0236( new THREE.Vector3().subVectors( pos1, pos3 ), qt );


		var offset = new THREE.Vector3().subVectors( pos3, pos2 );
		var pos2 = new THREE.Vector3().addVectors( pos1, offset );

		var centerCam_2 = pos1.clone();
		
		if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam_2.copy( pos2 ); } }
		
		if ( v1.z >= 0.5) 
		{ 
			infProject.camera.d3.targetO.position.copy(centerCam_2);
			camera.position.copy( pos3 ); 	
		}			
	}
	if(camera3D.userData.camera.type == 'first')
	{
		
	}
}





function fname_s_099()
{
	if ( camera != cameraTop ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		
		
		
		var minX = obj_point[0].position.x; 
		var maxX = obj_point[0].position.x;
		var minZ = obj_point[0].position.z; 
		var maxZ = obj_point[0].position.z;		

		for ( var i = 0; i < obj_point.length; i++ )
		{
			if(obj_point[i].position.x < minX) { minX = obj_point[i].position.x; }
			if(obj_point[i].position.x > maxX) { maxX = obj_point[i].position.x; }
			if(obj_point[i].position.z < minZ) { minZ = obj_point[i].position.z; }
			if(obj_point[i].position.z > maxZ) { maxZ = obj_point[i].position.z; }
		}				
		
		pos = new THREE.Vector3((maxX - minX)/2 + minX, 0, (maxZ - minZ)/2 + minZ);		
	}

			
	if(1==2)
	{
		newCameraPosition = {position2D: new THREE.Vector3(pos.x, cameraTop.position.y, pos.z)};
	}
	else
	{
		cameraTop.position.x = pos.x;
		cameraTop.position.z = pos.z;
		newCameraPosition = null;
	}
}


function fname_s_0100()
{
	if ( camera != camera3D ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		for ( var i = 0; i < obj_point.length; i++ ) { pos.add( obj_point[ i ].position ); }
		pos.divideScalar( obj_point.length );
	}

	newCameraPosition = { position3D: new THREE.Vector3( pos.x, 0, pos.z )};

}


function fname_s_0101()
{

	if ( !newCameraPosition ) return;
	
	if ( camera == camera3D && newCameraPosition.positionFirst || camera == camera3D && newCameraPosition.positionFly )
	{
		var pos = (newCameraPosition.positionFirst) ? newCameraPosition.positionFirst : newCameraPosition.positionFly;
		
		camera.position.lerp( pos, 0.1 );
		
		
		if(newCameraPosition.positionFirst)
		{
			var dir = camera.getWorldDirection(new THREE.Vector3()); 			
			dir.y = 0; 
			dir.normalize();
			dir.add( newCameraPosition.positionFirst );	
			camera.lookAt( dir );
		}
		if(newCameraPosition.positionFly)
		{
			var radius_1 = camera3D.userData.camera.save.radius;
			var radius_2 = infProject.camera.d3.targetO.position.distanceTo(camera.position);
			
			var k = Math.abs((radius_2/radius_1) - 1);
			
			var dir = camera.getWorldDirection(new THREE.Vector3()); 			
			dir.y = 0; 
			dir.normalize();
			dir.x *= 15*k;
			dir.z *= 15*k;
			dir.add( infProject.camera.d3.targetO.position );	
			
			camera.lookAt( dir ); 
		}		
		
		
		if(fname_s_021(camera.position, pos)) 
		{ 	
			newCameraPosition = null; 
		};		
	}
	else
	{
		newCameraPosition = null;
	}
	
	renderCamera();
}





function fname_s_0102()
{
	var ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
	if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
	if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
	if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
	if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
	if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
	if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

	
	if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

	
	return 'Search Bot';
}






function fname_s_0103() 
{
	var arr = []; 
	
	var geometry1 = new THREE.SphereGeometry( 0.07, 16, 16 );
	var geometry2 = new THREE.SphereGeometry( 0.05, 16, 16 );
	
	for ( var i = 0; i < 4; i++ )
	{
		var obj = new THREE.Mesh( geometry1, new THREE.MeshLambertMaterial( { transparent: true, opacity: 0 } ) );
		
		obj.userData.tag = 'controll_wd';
		obj.userData.controll_wd = { id : i, obj : null };		
		obj.visible = false;
		
		
		var child = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, opacity: 1, depthTest: false, lightMap : lightMap_1 } ) );
		child.renderOrder = 2;
		obj.add( child );
		 
		arr[i] = obj;
		scene.add( arr[i] );
	}		
	
	return arr;
}






function fname_s_0104( wall, obj )
{	
	var p = [];	
	
	obj.geometry.computeBoundingBox(); 
	obj.geometry.computeBoundingSphere(); 	
	
	var bound = obj.geometry.boundingBox;
	var center = obj.geometry.boundingSphere.center; 


	var arrVisible = [true, true, true, true];
	
	if(camera == cameraTop) { arrVisible = [true, true, false, false]; }
	else if(camera == camera3D) { arrVisible = [false, false, false, false]; }
	
	if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
	{
		if(!obj.userData.door.topMenu) { arrVisible = [false, false, false, false]; }
		
		
		p[0] = obj.localToWorld( new THREE.Vector3(bound.min.x, center.y, center.z) );
		p[1] = obj.localToWorld( new THREE.Vector3(bound.max.x, center.y, center.z) );
		p[2] = obj.localToWorld( new THREE.Vector3(center.x, bound.min.y, center.z) );
		p[3] = obj.localToWorld( new THREE.Vector3(center.x, bound.max.y, center.z) );		
	}
	else
	{
		arrVisible = [false, false, false, false];
		
		
		var p3 = [];
		p3[0] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, center.y, bound.min.z)) );	
		p3[1] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, center.y, bound.max.z)) );		
		p3[2] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, center.y, bound.min.z)) );
		p3[3] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, center.y, bound.max.z)) );

		var min = { vx: p3[0].x, vz: p3[0].z };
		var max = { vx: p3[0].x, vz: p3[0].z };
		
		for ( var i = 0; i < p3.length; i++ )
		{
			if(min.vx > p3[i].x) { min.vx = p3[i].x; }
			if(max.vx < p3[i].x) { max.vx = p3[i].x; }
			if(min.vz > p3[i].z) { min.vz = p3[i].z; }
			if(max.vz < p3[i].z) { max.vz = p3[i].z; }			
		}
		
		p[0] = wall.localToWorld( new THREE.Vector3(min.vx, p3[0].y, (min.vz - max.vz)/2 + max.vz) );
		p[1] = wall.localToWorld( new THREE.Vector3(max.vx, p3[0].y, (min.vz - max.vz)/2 + max.vz) );
		
		p[2] = obj.localToWorld( new THREE.Vector3(center.x, bound.min.y, center.z) );
		p[3] = obj.localToWorld( new THREE.Vector3(center.x, bound.max.y, center.z) );		
	}

	var arr = infProject.tools.controllWD;
	for ( var i = 0; i < arr.length; i++ )
	{		
		arr[i].position.copy( p[i] );	
		arr[i].rotation.copy( wall.rotation );
		arr[i].visible = arrVisible[i];
		arr[i].obj = obj; 
		arr[i].userData.controll_wd.obj = obj;
	}
}


		
		


function fname_s_0105(obj)
{
	var wall = obj.userData.door.wall;   

	fname_s_0104( wall, obj );		
	
	
	var boundPos = [];
	
	if(camera == cameraWall)
	{
		var arr = fname_s_0134(wall, arrWallFront.wall[0].index, fname_s_0136(wall, (arrWallFront.wall[0].index == 1) ? 1 : 0));
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();		
	}
	else	
	{
		
		var arr = fname_s_0134(wall, 1, fname_s_0136(wall, 1));	
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();
		
		var arr = fname_s_0134(wall, 2, fname_s_0136(wall, 0));
		boundPos[2] = arr[0].clone();
		boundPos[3] = arr[2].clone();  		
	}	
	
	
	for ( var i = 0; i < arrWallFront.wall.length; i++ )
	{
		arrWallFront.wall[i].obj.userData.wall.html.label[0].style.display = 'none';
		arrWallFront.wall[i].obj.userData.wall.html.label[1].style.display = 'none';
		
		arrWallFront.wall[i].obj.userData.wall.html.label[0].userData.elem.show = false;
		arrWallFront.wall[i].obj.userData.wall.html.label[1].userData.elem.show = false;
	}
	
	var v = wall.userData.wall.v;
	var vZ = v[0].z + (v[4].z - v[0].z) / 2; 
	
	for ( var i = 0; i < boundPos.length; i++ ){ boundPos[i].z = vZ; boundPos[i].y = 0; wall.localToWorld( boundPos[i] ); } 

	
	obj.userData.door.ruler.boundPos = boundPos;	
	
	
	if(clickO.rayhit.object.userData.tag == 'window' || clickO.rayhit.object.userData.tag == 'door') 
	{ 
		
		obj.userData.door.ruler.faceIndex = clickO.rayhit.face.normal.z;
	}	 
	
	fname_s_0106(obj);  
}




function fname_s_0106(wd)
{
	if(camera != cameraTop) return;
	
	var wall = wd.userData.door.wall;
	
	var line = infProject.scene.size.wd_1.line;	
	var label_2 = infProject.html.wd;
	
	var p1 = wall.userData.wall.p[0].position;
	var p2 = wall.userData.wall.p[1].position;
	
	
	var dirW = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var ang2 = Math.atan2(dirW.x, dirW.z);
	if(ang2 <= 0.001){ ang2 += Math.PI / 2;  }
	else { ang2 -= Math.PI / 2; }	
	
	
	
	var b2 = [];
	wd.updateMatrixWorld();
	var bound = wd.geometry.boundingBox;
	b2[0] = wd.localToWorld( new THREE.Vector3(bound.min.x, 0, 0) ); 
	b2[1] = wd.localToWorld( new THREE.Vector3(bound.max.x, 0, 0) );	
	b2[0].y = b2[1].y = p1.y;
	
	
	
	var pw = [];
	
	if(1==2)	
	{
		pw[0] = wd.userData.door.ruler.boundPos[0]; 	
		pw[1] = wd.userData.door.ruler.boundPos[1]; 	
		pw[2] = wd.userData.door.ruler.boundPos[2]; 	
		pw[3] = wd.userData.door.ruler.boundPos[3]; 	
	}
	else
	{
		pw[0] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[0].x, 0, 0) ); 
		pw[1] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[6].x, 0, 0) ); 
		pw[2] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[4].x, 0, 0) ); 
		pw[3] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[10].x, 0, 0) );		
	}		 	
	
	
	var dirW = wall.getWorldDirection(new THREE.Vector3());
	var offset_1 = new THREE.Vector3().addScaledVector( dirW, wall.userData.wall.v[0].z ).multiplyScalar( 1.3 );
	var offset_2 = new THREE.Vector3().addScaledVector( dirW, wall.userData.wall.v[4].z ).multiplyScalar( 1.3 );


	var dir = [];
	dir[0] = new THREE.Vector3().subVectors( p2, p1 ).normalize();
	dir[1] = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	
	
	var arrP = [];
	arrP[0] = {p1: b2[0], p2: pw[0], offset: offset_1, dir: dir[0]};
	arrP[1] = {p1: b2[1], p2: pw[1], offset: offset_1, dir: dir[1]};
	arrP[2] = {p1: b2[0], p2: pw[2], offset: offset_2, dir: dir[0]};
	arrP[3] = {p1: b2[1], p2: pw[3], offset: offset_2, dir: dir[1]};			
	arrP[4] = {p1: b2[0], p2: b2[1], offset: offset_1, dir: dir[1]};
	arrP[5] = {p1: b2[0], p2: b2[1], offset: offset_2, dir: dir[1]};
	
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var d = arrP[i].p1.distanceTo( arrP[i].p2 );	
		
		var v = line[i].geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = -d/2;
		v[3].x = v[2].x = v[5].x = v[4].x = d/2;		
		line[i].geometry.verticesNeedUpdate = true;			
		
		var pos = new THREE.Vector3().subVectors( arrP[i].p1, arrP[i].p2 ).divideScalar( 2 ).add(arrP[i].p2);	
		
		
		if(1==1)
		{
			var dir = new THREE.Vector3().subVectors( arrP[i].p1, arrP[i].p2 ).normalize();			
			d = (dir.dot(arrP[i].dir) < - 0.99) ? -d : d;
		}
		
		line[i].position.copy(pos).add(arrP[i].offset);
		line[i].rotation.copy(wall.rotation);		
					
		label_2[i].textContent = Math.round(d * 100) / 100 + ' м';
		label_2[i].userData.elem.pos = pos.clone().add(arrP[i].offset.clone().multiplyScalar( 2 ));		
		label_2[i].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-ang2)+'deg)';
		label_2[i].style.display = 'block';
		label_2[i].userData.elem.show = true;
		
		fname_s_0211({elem: label_2[i]});		
		
		line[i].visible = true;			
		line[i].updateMatrixWorld();
		
		for ( var i2 = 0; i2 < line[i].userData.rulerwd.cone.length; i2++ )
		{
			var cone = line[i].userData.rulerwd.cone[i2];
			
			var xp = v[0].x;
			var zr = -Math.PI/2;
			
			if(i2 == 1) { xp = v[3].x; zr = Math.PI/2; }
			
			var pos = line[i].localToWorld( new THREE.Vector3(xp, 0, 0) );
			cone.position.copy(pos);
			cone.rotation.set(-Math.PI/2, 0, wall.rotation.y-zr);
			
			cone.visible = true;
		}
	}
		
}









function fname_s_0107( intersect, cdm )
{
	clickO.move = intersect.object; 
	var controll = intersect.object;	
	var wd = controll.userData.controll_wd.obj;
	var wall = wd.userData.door.wall;
	var pos2 = new THREE.Vector3();
	
	
	var m = controll.userData.controll_wd.id;
	
	if(camera == cameraTop)
	{
		planeMath.position.set( 0, intersect.point.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		
		var v = wall.userData.wall.v;
		var z = v[0].z + (v[4].z - v[0].z) / 2;
	
		if(m == 0) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.min.x, controll.position.y, z) ); }
		else if(m == 1) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.max.x, controll.position.y, z) ); }				
	}
	else if(camera == cameraWall)
	{
		
		planeMath.position.copy( intersect.point );
		planeMath.rotation.set( 0, controll.rotation.y, 0 );
		
		var dir = new THREE.Vector3().subVectors( wall.userData.wall.p[1].position, wall.userData.wall.p[0].position ).normalize();
		
		if(m == 0) { pos2 = new THREE.Vector3().addVectors( controll.position, dir ); }
		else if(m == 1) { pos2 = new THREE.Vector3().subVectors( controll.position, dir ); }	
		else if(m == 2) { pos2 = controll.position.clone(); pos2.y = -9999; }
		else if(m == 3) { pos2 = controll.position.clone(); pos2.y = 9999; }
	}

	
	var offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point ); 
	var dir = new THREE.Vector3().subVectors( controll.position, pos2 ).normalize();  
	var qt = fname_s_0238( dir );

	
	wd.userData.door.wall.controll = {  }; 
	wd.userData.door.wall.controll.obj = controll;
	wd.userData.door.wall.controll.pos = controll.position.clone();
	wd.userData.door.wall.controll.dir = dir;
	wd.userData.door.wall.controll.qt = qt;
	wd.userData.door.wall.controll.offset = offset;
	
	var ps = [];
	var arr = infProject.tools.controllWD;
	ps[ps.length] = wall.worldToLocal( arr[0].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[1].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[2].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[3].position.clone() );
	
	wd.userData.door.wall.controll.arrPos = ps;
	
	wd.updateMatrixWorld();	
	wall.updateMatrixWorld();
	
	param_win.click = true;
}

 

 

function fname_s_0108( event, controll )
{	
	var intersects = fname_s_0230( event, planeMath, 'one' ); 	
	if ( intersects.length < 1 ) return; 
	
	var wd = controll.userData.controll_wd.obj;
	var wall = wd.userData.door.wall;

	
	if(param_win.click) 
	{ 
		param_win.click = false; 

		wallClone.geometry = fname_s_038( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
		
		objsBSP = { wall : wallClone, wd : fname_s_039( wd ) };
		
		
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		
	}	
	
	var pos = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.offset, intersects[ 0 ].point );	
	var v1 = fname_s_0236( new THREE.Vector3().subVectors( pos, wd.userData.door.wall.controll.pos ), wd.userData.door.wall.controll.qt );
	v1 = new THREE.Vector3().addScaledVector( wd.userData.door.wall.controll.dir, v1.z );  
	v1 = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.pos, v1 );	


	
	if(1==2)
	{		
		var pos2 = wall.worldToLocal( v1.clone() );	

		function fname_s_0109(pos, pos2)
		{
			var res = Math.floor((pos2 - pos) * 10)/10;
			
			return pos2 - res;
		}		
 
		if(controll.userData.controll_wd.id == 0)
		{  
			pos2.x = fname_s_0109(pos2.x, wd.userData.door.wall.controll.arrPos[1].x);
			
			var x_min = wd.userData.door.bound.min.x;  
			if(pos2.x < x_min){ pos2.x = x_min; } 	
			else if(pos2.x > wd.userData.door.wall.controll.arrPos[1].x - 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[1].x - 0.2; }		
		}		
		else if(controll.userData.controll_wd.id == 1)
		{
			pos2.x = fname_s_0109(pos2.x, wd.userData.door.wall.controll.arrPos[0].x);
			
			var x_max = wd.userData.door.bound.max.x;
			if(pos2.x > x_max){ pos2.x = x_max; }
			else if(pos2.x < wd.userData.door.wall.controll.arrPos[0].x + 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[0].x + 0.2; }							
		}
		else if(controll.userData.controll_wd.id == 2)
		{
			pos2.y = fname_s_0109(pos2.y, wd.userData.door.wall.controll.arrPos[3].y);
			
			var y_min = wd.userData.door.bound.min.y + 0.1;
			if(pos2.y < y_min){ pos2.y = y_min; }
			else if(pos2.y > wd.userData.door.wall.controll.arrPos[3].y - 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[3].y - 0.2; }		
		}		
		else if(controll.userData.controll_wd.id == 3)
		{
			pos2.y = fname_s_0109(pos2.y, wd.userData.door.wall.controll.arrPos[2].y);
			
			var y_max = wd.userData.door.bound.max.y;
			if(pos2.y > y_max){ pos2.y = y_max; }
			else if(pos2.y < wd.userData.door.wall.controll.arrPos[2].y + 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[2].y + 0.2; }					
		}		
		
		v1 = wall.localToWorld( pos2 );			
	}
	
	var pos2 = new THREE.Vector3().subVectors( v1, controll.position );  
	controll.position.copy( v1 ); 	

	
	{
		var arr = infProject.tools.controllWD;
		
		var x = arr[0].position.distanceTo(arr[1].position);
		var y = arr[2].position.distanceTo(arr[3].position);
		
		var pos = pos2.clone().divideScalar( 2 ).add( wd.position.clone() );
		
		сhangeSizePosWD( wd, pos, x, y );
	}
	
	
	var arr = infProject.tools.controllWD;	
	if(controll.userData.controll_wd.id == 0 || controll.userData.controll_wd.id == 1)
	{ 
		arr[2].position.add( pos2.clone().divideScalar( 2 ) );
		arr[3].position.add( pos2.clone().divideScalar( 2 ) );
	}
	else if(controll.userData.controll_wd.id == 2 || controll.userData.controll_wd.id == 3)
	{ 
		arr[0].position.add( pos2.clone().divideScalar( 2 ) );
		arr[1].position.add( pos2.clone().divideScalar( 2 ) );
	}	
	
	 
	fname_s_0145(wd);
	
	fname_s_0106(wd);
}




function fname_s_0110( controll )
{
	if(param_win.click) { param_win.click = false; return; }
	
	var wd = controll.userData.controll_wd.obj;
	
	objsBSP.wd = fname_s_039( wd );
	
	fname_s_040( wd, objsBSP );
	
	if(camera == cameraTop)
	{ 
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		wd.material.depthTest = true;
		wd.material.transparent = true;
		wd.material.opacity = 0;					
	}
	
	clickO.last_obj = wd;
}





function fname_s_0111( intersect )
{
	if(clickO.move)
	{
		if(clickO.move.userData.tag == 'free_dw') { return; }	
	}	 
	
	var obj = intersect.object;	
	clickO.move = obj;
	

	offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point );
	planeMath.position.set( 0, intersect.point.y, 0 );
	planeMath.rotation.set(-Math.PI/2, 0, 0);	

	param_win.click = true;	
	param_wall.wallR = fname_s_0118([], clickO.move);

	
	if(1==1)
	{  
		obj.userData.point.last.pos = obj.position.clone(); 		
		
		for ( var i = 0; i < param_wall.wallR.length; i++ )
		{						
			for ( var i2 = 0; i2 < param_wall.wallR[i].userData.wall.arrO.length; i2++ )
			{
				var wd = param_wall.wallR[i].userData.wall.arrO[i2];
				 
				wd.userData.door.last.pos = wd.position.clone();
				wd.userData.door.last.rot = wd.rotation.clone(); 
			}
		}		 			
	}

	fname_s_029({obj: obj}); 	
}



function fname_s_0112()
{
	var arr = [];
	
	for ( var i = 0; i < clickO.move.w.length; i++ )
	{
		arr[i] = { id : clickO.move.w[i].userData.id, arrO : [] };
		
		for ( var i2 = 0; i2 < clickO.move.w[i].userData.wall.arrO.length; i2++ )
		{
			arr[i].arrO[i2] = { pos : '', rot : '' };
			arr[i].arrO[i2].pos = clickO.move.w[i].userData.wall.arrO[i2].position.clone();
			arr[i].arrO[i2].rot = clickO.move.w[i].userData.wall.arrO[i2].rotation.clone();			 
		}
	}

	return arr;
}





function fname_s_0113( event, obj )
{
	if(obj.userData.point.type) 
	{ 
		if(obj.userData.point.type == 'continue_create_wall') {  } 
		else { fname_s_0115( event, obj ); return; } 
	}	
	
	if(param_win.click) 
	{
		fname_s_041(param_wall.wallR);
		param_win.click = false;
	}	
	
	var intersects = fname_s_0230( event, planeMath, 'one' ); 
	
	if ( intersects.length > 0 ) 
	{
		var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );				
		pos.y = obj.position.y; 
		
		var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
		
		obj.position.copy( pos );				
		fname_s_0115( event, obj );	
				
		 
		for ( var i = 0; i < obj.w.length; i++ )
		{			
			fname_s_03(obj.w[i]);	
		}		
	
		fname_s_0121(obj);			
		
		fname_s_044(obj.w); 
	}
	
}


function fname_s_0114(point, point2, wall, side, pos2)
{
	var v = wall.userData.wall.v;
	
	var offX = 0; 
	
	if(side == 0)
	{
		var x1 = v[6].x - (v[0].x + offX);
		var x2 = v[10].x - (v[4].x + offX);	
		var xmin = (x1 < x2) ? x1 : x2;		
	}
	if(side == 1)
	{
		var n = v.length;
		var x1 = (v[n - 6].x - offX) - v[n - 12].x;
		var x2 = (v[n - 2].x - offX) - v[n - 8].x;	
		var xmin = (x1 < x2) ? x1 : x2;			
	}

	
	
	if(xmin <= 0.1)
	{		
		var dir = new THREE.Vector3().subVectors( point.position, point2.position ).normalize();
		var v1 = new THREE.Vector3().addScaledVector( dir, Math.abs(xmin - 0.1) + 0.1 );		
		point.position.add( v1 );
	}
	
	return point.position;
}




function fname_s_0115( event, obj )
{	
	var arrDp = [];
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	
	for ( var i = 0; i < wall.length; i++ ){ arrDp[arrDp.length] = wall[i]; } 
	for ( var i = 0; i < window.length; i++ ){ arrDp[arrDp.length] = window[i]; } 
	for ( var i = 0; i < door.length; i++ ){ arrDp[arrDp.length] = door[i]; }  
	arrDp[arrDp.length] = planeMath;
	
	var intersects = fname_s_0230( event, arrDp, 'arr' );
	
	var plane = null;
	var point = null;
	var wall = null;	
	var dw = null;
	var pos = new THREE.Vector3();	
	
	for ( var i = 0; i < intersects.length; i++ ) 
	{
		var object = intersects[ i ].object;
		
		if(object.userData.tag == 'planeMath')
		{ 
			pos = intersects[i].point; 
			obj.position.set( pos.x, obj.position.y, pos.z ); 
			plane = object; 
		} 			
		else if(object.userData.tag == 'wall')
		{ 			
			var flag = true;
			for ( var i2 = 0; i2 < object.userData.wall.p.length; i2++ ) 
			{				
				if(object.userData.wall.p[i2].userData.id == obj.userData.id) { flag = false; break; }									
			}
			if(flag) { wall = object; }			
		}
		else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ dw = object; } 
	}
	
	
	for ( var i = 0; i < obj_point.length; i++ )
	{
		if(obj_point[i] == obj) { continue; }		

		var p1 = new THREE.Vector3( obj.position.x, 0, obj.position.z ); 
		var p2 = new THREE.Vector3( obj_point[i].position.x, 0, obj_point[i].position.z ); 
		
		if(p1.distanceTo( p2 ) < 0.2 / camera.zoom)
		{ 
			obj.position.set( obj_point[i].position.x, obj.position.y, obj_point[i].position.z );
			obj.userData.point.cross = point = obj_point[i];
			break;
		}	
	}	
 
	  
	if(point) 
	{
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;		
	} 
	else if(dw)
	{
		obj.userData.point.cross = null; 
	}
	else if(!wall) 
	{ 
		obj.userData.point.cross = plane;
		
		fname_s_0116( obj );		
	}
	else
	{ 
		wall.updateMatrixWorld();			
		var pos = wall.worldToLocal( pos.clone() );	
		var pos = wall.localToWorld( new THREE.Vector3(pos.x, 0, 0 ) ); 		
		obj.position.set( pos.x, obj.position.y, pos.z ); 
		obj.userData.point.cross = wall; 
		
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;

		fname_s_0116( obj );
	}
}

  




function fname_s_0116( point )
{ 
	var pX = [];
	var pZ = [];
	
	for ( var i = 0; i < obj_point.length; i++ )
	{
		if(obj_point[i] == point) { continue; }		

		var p1 = fname_s_017(obj_point[i].position, new THREE.Vector3().addVectors(obj_point[i].position, new THREE.Vector3(10,0,0)), point.position);	
		var p2 = fname_s_017(obj_point[i].position, new THREE.Vector3().addVectors(obj_point[i].position, new THREE.Vector3(0,0,10)), point.position);
		
		var x = Math.abs( obj_point[i].position.x - p1.x );
		var z = Math.abs( obj_point[i].position.z - p2.z );
		
		if(x < 0.06 / camera.zoom){ pX[pX.length] = i; }
		if(z < 0.06 / camera.zoom){ pZ[pZ.length] = i; }			
	}
	
	
	if(pX.length > 0)
	{
		var v = [];
		for ( var i = 0; i < pX.length; i++ ){ v[i] = obj_point[pX[i]].position; }
		var n1 = pX[fname_s_0141(v, point.position)];		 
	} 
	
	if(pZ.length > 0)
	{
		var v = [];
		for ( var i = 0; i < pZ.length; i++ ){ v[i] = obj_point[pZ[i]].position; }
		var n2 = pZ[fname_s_0141(v, point.position)]; 		
	}	
	
	
	if(pX.length > 0 && pZ.length > 0) 
	{ 
		point.position.x = obj_point[n1].position.x; 
		point.position.z = obj_point[n2].position.z; 		
		fname_s_0117(point, obj_point[n1].position, infProject.tools.axis[0], 'xz'); 
		fname_s_0117(point, obj_point[n2].position, infProject.tools.axis[1], 'xz'); 
	}
	else
	{
		(pX.length > 0) ? fname_s_0117(point, obj_point[n1].position, infProject.tools.axis[0], 'x') : infProject.tools.axis[0].visible = false;
		(pZ.length > 0) ? fname_s_0117(point, obj_point[n2].position, infProject.tools.axis[1], 'z') : infProject.tools.axis[1].visible = false;
	}
}

 



function fname_s_0117(point, pos2, lineAxis, axis)
{
	
	if(axis == 'x') { point.position.x = pos2.x; }
	if(axis == 'z') { point.position.z = pos2.z; } 
	
	var pos2 = new THREE.Vector3(pos2.x, point.position.y, pos2.z);

	var dir = new THREE.Vector3().subVectors( point.position, pos2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	lineAxis.rotation.set(0, angleDeg + Math.PI / 2, 0);		
	lineAxis.position.copy( point.position );
	lineAxis.visible = true;	
}


 



function fname_s_0118(arr, point) 
{	
	for ( var i = 0; i < point.p.length; i++ )
	{				
		for ( var j = 0; j < point.p[i].w.length; j++ )
		{
			var flag = false;
			for ( var i2 = 0; i2 < arr.length; i2++ )
			{
				if(point.p[i].w[j] == arr[i2]){ flag = true; break; }
			}
			
			if(flag){ continue; }				

			arr[arr.length] = point.p[i].w[j];
		}		
	}
	
	return arr;	
}



function fname_s_0119(wall) 
{	
	var arr = [];

	for ( var j = 0; j < wall.userData.wall.p.length; j++ )
	{
		for ( var i = 0; i < wall.userData.wall.p[j].p.length; i++ )
		{ 
			for ( var i2 = 0; i2 < wall.userData.wall.p[j].p[i].w.length; i2++ ) 
			{ 	
				var flag = true;
				for ( var i3 = 0; i3 < arr.length; i3++ )
				{
					if(arr[i3] == wall.userData.wall.p[j].p[i].w[i2]) { flag = false; }
				}

				if(flag) { arr[arr.length] = wall.userData.wall.p[j].p[i].w[i2]; }
			} 
		}		
	}
	
	return arr;	
}




function fname_s_0120(wall) 
{	
	var arr = [];

	for ( var i = 0; i < wall.userData.wall.p.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.userData.wall.p[i].w.length; i2++ )
		{ 
			var flag = true;
			for ( var i3 = 0; i3 < arr.length; i3++ )
			{
				if(arr[i3] == wall.userData.wall.p[i].w[i2]) { flag = false; }
			}

			if(flag) { arr[arr.length] = wall.userData.wall.p[i].w[i2]; } 
		}		
	}
	
	return arr;	
}




function fname_s_0121(point)
{		
	
	fname_s_0122(point);	

	
	
	var arrP = point.p;
	for ( var j = 0; j < arrP.length; j++ )
	{
		
		if(arrP[j].p.length > 1) { fname_s_0122(arrP[j]); }		
	}
	
}


function fname_s_0122(point)
{
	var arrP = point.p;
	var arrW = point.w;
	var arrS = point.start;
	
	var arrD = [];
	
	var n = 0;
	for ( var i = 0; i < arrP.length; i++ )
	{
		if(point.position.distanceTo(arrP[i].position) < 0.01)
		{ 
			for ( var i2 = 0; i2 < arrW[i].geometry.vertices.length; i2++ )
			{
				arrW[i].geometry.vertices[i2].x = 0;
			}	
			continue; 
		}
		
		arrD[n] = {id: i};
		
		var dir = new THREE.Vector3().subVectors( point.position, arrP[i].position ).normalize();
		arrD[n].angel = Math.atan2(dir.x, dir.z);
		
		if(arrD[n].angel < 0){ arrD[n].angel += Math.PI * 2; }		
		n++;
	}
	
	arrD.sort(function (a, b) { return a.angel - b.angel; });
	
	for ( var i = 0; i < arrD.length; i++ )
	{ 
		var i2 = (i == arrD.length - 1) ? 0 : (i + 1);
		
		fname_s_0123(arrW[arrD[i].id], arrW[arrD[i2].id], arrS[arrD[i].id], arrS[arrD[i2].id], point.position); 
	}	

}



function fname_s_0123(line1, line2, s1, s2, pointC)
{
	var v1 = line1.geometry.vertices;
	var v2 = line2.geometry.vertices;
	
	if(s1 == 1){ var n1 = 0; var n2 = 6; var n3 = 7; var n4 = 8; var n5 = 9; }
	else { var n1 = 10; var n2 = 4; var n3 = 5; var n4 = 2; var n5 = 3; }
	
	if(s2 == 1){ var f1 = 4; var f2 = 10; var f3 = 11; var f4 = 8; var f5 = 9; }
	else { var f1 = 6; var f2 = 0; var f3 = 1; var f4 = 2; var f5 = 3; }


	
	
	line1.updateMatrixWorld();
	var m1a = line1.localToWorld( v1[n1].clone() );
	var m1b = line1.localToWorld( v1[n2].clone() );

	line2.updateMatrixWorld();
	var m2a = line2.localToWorld( v2[f1].clone() );
	var m2b = line2.localToWorld( v2[f2].clone() );


	
	var crossP = fname_s_09(m1a, m1b, m2a, m2b);

	var cross = false;
	
	if(!crossP[1]) { if(fname_s_0124(m1a, m1b, m2a, m2b)) { cross = true; } }	
	
	if(cross)
	{		
		var per1 = line1.worldToLocal( crossP[0].clone() ).x;
		var per2 = line2.worldToLocal( crossP[0].clone() ).x;
		var per3 = line1.worldToLocal( pointC.clone() ).x;
		var per4 = line2.worldToLocal( pointC.clone() ).x;
	}
	else
	{		
		var per1 = line1.worldToLocal( pointC.clone() ).x; 
		var per2 = line2.worldToLocal( pointC.clone() ).x;		
		
		var per3 = line1.worldToLocal( pointC.clone() ).x;
		var per4 = line2.worldToLocal( pointC.clone() ).x;	
	}


	v1[n2].x = v1[n3].x = per1;
	v2[f2].x = v2[f3].x = per2;
	
	v1[n4].x = v1[n5].x = per3;
	v2[f4].x = v2[f5].x = per4;	

	line1.geometry.verticesNeedUpdate = true;	
	line2.geometry.verticesNeedUpdate = true;
	
	line1.geometry.computeBoundingBox(); 	
	line1.geometry.computeBoundingSphere();	
	
	line2.geometry.computeBoundingBox(); 	
	line2.geometry.computeBoundingSphere();	
	
	
	if(line1.userData.wall.svg.lineW)
	{
		line1.updateMatrixWorld();
		var m1a = line1.localToWorld( v1[n1].clone() );
		var m1b = line1.localToWorld( v1[n2].clone() );		
		
		if(s1 == 1) { fname_s_0324({el: line1.userData.wall.svg.lineW[0], point: [m1a, m1b]}); }
		else { fname_s_0324({el: line1.userData.wall.svg.lineW[1], point: [m1a, m1b]}); }
	}

	if(line2.userData.wall.svg.lineW && 1==1)
	{
		line2.updateMatrixWorld();
		var m1a = line2.localToWorld( v2[f1].clone() );
		var m1b = line2.localToWorld( v2[f2].clone() );		
		
		if(s1 == 1) { fname_s_0324({el: line2.userData.wall.svg.lineW[0], point: [m1a, m1b]}); }
		else { fname_s_0324({el: line2.userData.wall.svg.lineW[1], point: [m1a, m1b]}); }
	}	
}






 
 
function fname_s_0124(p0, p1, p2, p3)
{			
	var dir = new THREE.Vector3().subVectors( p1, p0 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 0.5 );
	var p1 = new THREE.Vector3().addVectors( p1, v1 );		
		
	var dir = new THREE.Vector3().subVectors( p3, p2 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 0.5 );
	var p3 = new THREE.Vector3().addVectors( p3, v1 );	
	
	if( !fname_s_013(p0, p1, p2, p3) ) {  return false; }		
	
	return true;
}



 
function fname_s_0125(p0, p1, p2, p3) 
{			
	var dir = new THREE.Vector3().subVectors( p1, p0 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 0.01 );
	var p0 = new THREE.Vector3().addVectors( p0, v1 );		
	var p1 = new THREE.Vector3().subVectors( p1, v1 );
	
	if( !fname_s_013(p0, p1, p2, p3) ) {  return false; }		
	
	return true;
}





function fname_s_0126( point, walls )
{
	point.position.copy( point.userData.point.last.pos );
	
	for ( var i = 0; i < point.p.length; i++ )
	{
		fname_s_03(point.w[i], {point:point});		
	}		
	
	fname_s_0121(point);  
	fname_s_044(walls);
	fname_s_0161(point.zone); 
	
	fname_s_042(walls);
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;		
}


function fname_s_0127(obj)
{  	
	if(fname_s_021(obj.userData.point.last.pos, obj.position)) { return; }		
	
	obj.userData.point.last.pos = obj.position.clone();
	
	fname_s_0121(obj);			
	
	fname_s_044(param_wall.wallR);	 
}







var param_wall = { click : false, wallR : [], posS : 0, qt_1 : [], qt_2 : [], arrZone : [] };


function fname_s_0128( intersect )
{
	var obj = intersect.object;
	
	clickO.move = obj;
	
	offset = new THREE.Vector3().subVectors( obj.position, intersect.point );
	planeMath.position.set( 0, intersect.point.y, 0 );	
	planeMath.rotation.set(-Math.PI/2, 0, 0);	

	param_win.click = true;	
	param_wall.posS = new THREE.Vector3().addVectors( intersect.point, offset );	
	  
	param_wall.wallR = fname_s_0119(obj);

	var p = obj.userData.wall.p;
	
	for ( var i = 0; i < p[0].w.length; i++ )
	{  
		var dir = new THREE.Vector3().subVectors( p[0].position, p[0].p[i].position ).normalize();	
		param_wall.qt_1[i] = fname_s_0238(dir);
	}
	
	for ( var i = 0; i < p[1].w.length; i++ )
	{ 
		var dir = new THREE.Vector3().subVectors( p[1].position, p[1].p[i].position ).normalize();
		param_wall.qt_2[i] = fname_s_0238(dir);
	}
	
	param_wall.arrZone = fname_s_0131(obj);

	clickO.click.wall = [...new Set([...p[0].w, ...p[1].w])];  
	
	fname_s_0130(obj);
	
	if(camera == cameraTop)
	{
		fname_s_029({obj: obj}); 	
	}
}


function fname_s_0129(cdm)
{
	var intersect = cdm.rayhit;
	
	
	if(!intersect) return;
	if(!intersect.face) return;
	var index = intersect.face.materialIndex;	
	
	if(index == 1 || index == 2) { } 
	else { return; }
	
	var obj = intersect.object;	
	
	clickO.obj = obj;
	clickO.index = index;  	

	fname_s_0207({arr: [obj]});
	fname_s_029({obj: obj, side: index});
}



function fname_s_0130(wall)
{
	wall.userData.wall.p[0].userData.point.last.pos = wall.userData.wall.p[0].position.clone();
	wall.userData.wall.p[1].userData.point.last.pos = wall.userData.wall.p[1].position.clone();
	
	var walls = fname_s_0119(wall);
	
	for ( var i = 0; i < walls.length; i++ )
	{		
		walls[i].userData.wall.last.pos = walls[i].position.clone();
		walls[i].userData.wall.last.rot = walls[i].rotation.clone();
		
		for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
		{
			var wd = walls[i].userData.wall.arrO[i2];
			 
			wd.userData.door.last.pos = wd.position.clone();
			wd.userData.door.last.rot = wd.rotation.clone(); 
		}
	}		 				
}
	




function fname_s_0131( wall )
{
	var m = 0;
	arr = [];
	
	for ( var i = 0; i < wall.userData.wall.p[0].zone.length; i++ ) { arr[m] = wall.userData.wall.p[0].zone[i]; m++; } 
	for ( var i = 0; i < wall.userData.wall.p[1].zone.length; i++ )
	{
		var flag = true;
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			if(wall.userData.wall.p[1].zone[i] == arr[i2]) { flag = false; break; }
		}
		
		if(flag) { arr[m] = wall.userData.wall.p[1].zone[i]; m++; }
	}

	return arr;	
}







function fname_s_0132( event, obj ) 
{		
	
	if(camera == camera3D) { fname_s_090( event ); return; }
	
	if(param_win.click) 
	{
		fname_s_041(param_wall.wallR);
		param_win.click = false;
	}	
	
	var intersects = fname_s_0230( event, planeMath, 'one' );
	
	if ( intersects.length > 0 ) 
	{
		var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );	
		
		
		
		var x1 = obj.userData.wall.p[1].position.z - obj.userData.wall.p[0].position.z;
		var z1 = obj.userData.wall.p[0].position.x - obj.userData.wall.p[1].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						
		
		var qt1 = fname_s_0238(dir);
		var v1 = fname_s_0236( new THREE.Vector3().subVectors( pos, param_wall.posS ), qt1 );	
		v1 = new THREE.Vector3().addScaledVector( dir, v1.z );
		pos = new THREE.Vector3().addVectors( param_wall.posS, v1 );

		var pos3 = obj.position.clone();
		var pos2 = new THREE.Vector3().subVectors( pos, obj.position );			
		
		
		
		pos2 = new THREE.Vector3().subVectors ( fname_s_0133(obj.userData.wall.p[0], pos2, param_wall.qt_1, dir), obj.userData.wall.p[0].position ); 
		pos2 = new THREE.Vector3().subVectors ( fname_s_0133(obj.userData.wall.p[1], pos2, param_wall.qt_2, dir), obj.userData.wall.p[1].position );
		
		
		pos2 = new THREE.Vector3(pos2.x, 0, pos2.z);
						
		obj.userData.wall.p[0].position.add( pos2 );
		obj.userData.wall.p[1].position.add( pos2 );		
		
		
		for ( var i = 0; i < clickO.click.wall.length; i++ )
		{ 
			fname_s_03(clickO.click.wall[i]);		
		}
		
		fname_s_0121(obj.userData.wall.p[0]);
		fname_s_0121(obj.userData.wall.p[1]);
		
		fname_s_044(obj.userData.wall.p[0].w);
		fname_s_044(obj.userData.wall.p[1].w);
	}	
}







function fname_s_0133(point, pos2, qt, dir2)
{
	var pos = new THREE.Vector3().addVectors ( point.position, pos2 );	
	
	for ( var i = 0; i < point.p.length; i++ )
	{
		if(point.w[i] == clickO.move){ continue; }
		
		var v = point.w[i].userData.wall.v;
		
		
		if(point.start[i] == 0)
		{
			var x1_a = v[0].x;
			var x1_b = v[4].x;				
			var x2_a = v[6].x;
			var x2_b = v[10].x;
			

			var v2 = fname_s_0236( new THREE.Vector3().subVectors( new THREE.Vector3(0,0,0), pos2 ), qt[i] );
			
			var fg1 = false;
			var fg2 = false;
			if(x2_a - (x1_a + v2.z) <= 0.05){ fg1 = true; }
			if(x2_b - (x1_b + v2.z) <= 0.05){ fg2 = true; } 
			if(fg1 & fg2)
			{ 
				if(x2_a - (x1_a + v2.z) < x2_b - (x1_b + v2.z) ){ fg2 = false; } 
				else{ fg1 = false; }
			}
			
						
			if(fg1)
			{				
				var zx1 = v[6].clone();	
				zx1.x -= 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[4], v[0] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );				
				pos = point.w[i].localToWorld( ps3.clone() );
			}			
			else if(fg2)
			{	
				var zx1 = v[10].clone();	
				zx1.x -= 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[0], v[4] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );			
				pos = point.w[i].localToWorld( ps3.clone() );	
			}
			
			
			if(fg1 | fg2)
			{
				var x1 = point.p[i].position.z - pos.z;
				var z1 = pos.x - point.p[i].position.x;			
				var dir = new THREE.Vector3(x1, 0, z1).normalize();						
				var ps = new THREE.Vector3().addVectors( pos, dir );
				pos = fname_s_08(ps, pos, point.position, new THREE.Vector3().addVectors( point.position, pos2 ));
			}
		}
		else if(point.start[i] == 1)
		{
			var v2 = fname_s_0236( new THREE.Vector3().subVectors( pos2, new THREE.Vector3(0,0,0) ), qt[i] );
			
			var n = v.length;				
			var x1_a = v[n - 12].x;
			var x1_b = v[n - 8].x;				
			var x2_a = v[n - 6].x;
			var x2_b = v[n - 2].x;	

			
			var fg1 = false;
			var fg2 = false;
			if((x2_a + v2.z) - x1_a < 0.05){ fg1 = true; }
			if((x2_b + v2.z) - x1_b < 0.05){ fg2 = true; }
			if(fg1 & fg2)
			{ 
				if((x2_a + v2.z) - x1_a < (x2_b + v2.z) - x1_b){ fg2 = false; } 
				else{ fg1 = false; }
			}			

			
			if(fg1)
			{
				var zx1 = v[v.length - 12].clone();	
				zx1.x += 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[v.length - 2], v[v.length - 6] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );				
				pos = point.w[i].localToWorld( ps3.clone() );
			}			
			else if(fg2)
			{			
				var zx1 = v[v.length - 8].clone();	
				zx1.x += 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[v.length - 6], v[v.length - 2] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );		
				pos = point.w[i].localToWorld( ps3.clone() );	
			}
			
			
			if(fg1 | fg2)
			{
				var x1 = point.p[i].position.z - pos.z;
				var z1 = pos.x - point.p[i].position.x;			
				var dir = new THREE.Vector3(x1, 0, z1).normalize();						
				var ps = new THREE.Vector3().addVectors( pos, dir );
				pos = fname_s_08(ps, pos, point.position, new THREE.Vector3().addVectors( point.position, pos2 ));
			}			
		}	

				
	}
	
	return pos;
}









function fname_s_0134(wall, index, room) 
{
	var p = wall.userData.wall.p;
	var dir1 = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize();						
	var unique = fname_s_0135([{ obj : wall, dir : 'forward' }], p, dir1);	
	
	var arrW = [];
	var arrS = [];
	for (i = 0; i < unique.length; i++) 
	{  
		arrW[i] = unique[i].obj; 
		arrS[i] = (unique[i].dir == 'forward') ? index : (index == 1) ? 2 : 1; 	
	}
	
		
	arrWallFront.index = index;  
	arrWallFront.room = room;
	arrWallFront.wall = [];	  
	arrWallFront.wall_2 = [];	
	
	
	
	if(room)
	{
		for (var i = arrW.length - 1; i >= 0; i--) 
		{ 
			var flag = true;
			
			for (var i2 = 0; i2 < room.w.length; i2++)  
			{
				if(arrW[i] == room.w[i2]) { flag = false; break; }
			}	

			if(flag) { arrW.splice(i, 1); arrS.splice(i, 1); }
		}

		
		var arrW2 = [];
		for (var i = 0; i < arrW.length; i++)
		{
			var p = arrW[i].userData.wall.p;
			
			for (var i2 = 0; i2 < p.length; i2++)
			{
				for (var i3 = 0; i3 < p[i2].w.length; i3++)
				{
					if(p[i2].w[i3] == arrW[i]) continue;		
					
					var flag = false;					
					for (var i4 = 0; i4 < arrW.length; i4++)  
					{
						if(p[i2].w[i3] == arrW[i4]) { flag = true; break; }		
					}										
					if(flag) { continue; }
				
					
					for (var i4 = 0; i4 < room.w.length; i4++)  
					{
						
						if(p[i2].w[i3] == room.w[i4]) 
						{ 
							var dir2 = new THREE.Vector3().subVectors( p[i2].w[i3].userData.wall.p[1].position, p[i2].w[i3].userData.wall.p[0].position ).normalize();
							var rad = new THREE.Vector3(dir1.z, 0, dir1.x).angleTo(new THREE.Vector3(dir2.z, 0, dir2.x));
							
							if(index == 2) if(Math.round(THREE.Math.radToDeg(rad)) > 90) continue;		
							if(index == 1) if(Math.round(THREE.Math.radToDeg(rad)) < 90) continue; 
							
							
							arrW2.push(p[i2].w[i3]); 
							break; 
						}	
					}					
				}
			}			
		}
		
		arrWallFront.wall_2 = arrW2; 	
	}
	

	
	for (i = 0; i < arrW.length; i++) 
	{ 
		arrWallFront.wall[i] = { obj : arrW[i], index : arrS[i] };  
	}


	
	var arrV2 = [];
	for (i = 0; i < arrW.length; i++)
	{
		arrW[i].updateMatrixWorld();
		var v = arrW[i].userData.wall.v;			
		
		var arrN = (arrS[i] == 2) ? [4,5,11,10] : [0,1,7,6];

		for (i2 = 0; i2 < arrN.length; i2++)
		{ 
			if(i == 0) { arrV2[arrV2.length] = v[arrN[i2]].clone(); }
			else 
			{ 
				var worldV = arrW[i].localToWorld( v[arrN[i2]].clone() ); 
				arrV2[arrV2.length] = arrW[0].worldToLocal( worldV );  
			}
		}
		
	}
	
	
	var box = { min : { x : arrV2[0].x, y : arrV2[0].y }, max : { x : arrV2[0].x, y : arrV2[0].y } };
	
	for (i = 0; i < arrV2.length; i++)
	{
		if(arrV2[i].x < box.min.x) { box.min.x = arrV2[i].x; }
		else if(arrV2[i].x > box.max.x) { box.max.x = arrV2[i].x; }
		
		if(arrV2[i].y < box.min.y) { box.min.y = arrV2[i].y; }
		else if(arrV2[i].y > box.max.y) { box.max.y = arrV2[i].y; }			
	}
	
	
	var arrV3 = 
	[
		new THREE.Vector3(box.min.x, box.min.y, 0), 
		new THREE.Vector3(box.min.x, box.max.y, 0),
		new THREE.Vector3(box.max.x, box.max.y, 0),
		new THREE.Vector3(box.max.x, box.min.y, 0), 
	];
	
	
	
	var arrV = [];
	
	for (i = 0; i < arrV3.length; i++)
	{
		var min = 99999;
		var n = 0;
		
		for (i2 = 0; i2 < arrV2.length; i2++)
		{
			var d = arrV3[i].distanceTo(arrV2[i2]); 
			
			if(min > d) { n = i2; min = d; }
		}
		
		arrV[i] = arrV2[n];
	}	
	
	arrV[arrV.length] = arrV[0].clone();
	
	var vZ = (index == 2) ? v[4].z : v[0].z;
	for (i = 0; i < arrV.length; i++) { arrV[i].z = vZ; }


	
	
	arrWallFront.bounds = { min : { x : 0, y : 0 }, max : { x : 0, y : 0 } };
	
	var xC = (box.max.x - box.min.x)/2 + box.min.x;
	var yC = (box.max.y - box.min.y)/2 + box.min.y;
	
	arrWallFront.bounds.min.x = wall.localToWorld( new THREE.Vector3(box.min.x, yC, vZ) );	 
	arrWallFront.bounds.max.x = wall.localToWorld( new THREE.Vector3(box.max.x, yC, vZ) );
	arrWallFront.bounds.min.y = wall.localToWorld( new THREE.Vector3(xC, box.min.y, vZ) );
	arrWallFront.bounds.max.y = wall.localToWorld( new THREE.Vector3(xC, box.max.y, vZ) );	
	
	return arrV;
}





function fname_s_0135(arr, p, dir1)
{
	
	var arrW = [...new Set([...p[0].w, ...p[1].w])];		
	
	
	for (var i = 0; i < arrW.length; i++)
	{ 	
		var flag = false;
		for (i2 = 0; i2 < arr.length; i2++) { if(arrW[i] == arr[i2].obj) { flag = true; break; } }
		if(flag) continue;
		
		var dir2 = new THREE.Vector3().subVectors( arrW[i].userData.wall.p[1].position, arrW[i].userData.wall.p[0].position ).normalize();
		
		var str = null;
		
		if(fname_s_021(dir1, dir2)) { str = 'forward'; }
		else if(fname_s_021(dir1, new THREE.Vector3(-dir2.x,-dir2.y,-dir2.z))) { str = 'back'; }
		
		if(str) 
		{ 	
			arr[arr.length] = { obj : arrW[i], dir : str }; 
			arr = fname_s_0135(arr, arrW[i].userData.wall.p, dir1); 
		}
	}		

	
	return arr;
}



function fname_s_0136(wall, index)
{
	var num = -1;
	
	for ( var i = 0; i < room.length; i++ ) 
	{  
		for ( var i2 = 0; i2 < room[i].w.length; i2++ )
		{
			if(wall == room[i].w[i2])
			{
				var side = (index == 1) ? 1 : 0;
				
				if(side == room[i].s[i2]) { num = i; }
				
				break;
			} 
		}	
	}

	if(num == -1) { return null;  };

	return room[num];
}




function fname_s_0137(wall)
{
	if(fname_s_021(wall.userData.wall.last.pos, wall.position)) { return; }		
	
	fname_s_0121( wall.userData.wall.p[ 0 ] );
	fname_s_0121( wall.userData.wall.p[ 1 ] );
	fname_s_044( param_wall.wallR ); 
	fname_s_0161( param_wall.arrZone ); 		
	
	fname_s_042(param_wall.wallR);
}




var param_win = { click : false };


function fname_s_0138( intersect )
{	
	var obj = intersect.object;

	clickO.move = obj;
	
	var pos = intersect.point;
	
	if(camera != cameraWall) { pos.y = obj.position.y; }
	
	if(camera == cameraTop) 
	{
		planeMath.position.set( 0, pos.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);			
	}
	else
	{
		planeMath.position.copy( pos );
		planeMath.rotation.set( 0, obj.rotation.y, 0 );					
	}	
	
	planeMath.updateMatrixWorld();  

	param_win.click = true;

	obj.userData.door.offset = new THREE.Vector3().subVectors( obj.position, pos );	
	
	fname_s_0139(obj);	
	
	if(camera == cameraTop)
	{
		fname_s_0105( obj ); 	
		fname_s_0145( obj );		
		
		fname_s_029({obj: obj}); 	
	}
}






function fname_s_0139(wd)
{
	wd.geometry.computeBoundingBox();
	
	var wall = wd.userData.door.wall;
	wall.geometry.computeBoundingBox();	
	
	var off = 0.0;	
	var off_2 = 0.0;
	
	wd.userData.door.bound = { min : { x : wall.geometry.boundingBox.min.x + off, y : wall.geometry.boundingBox.min.y + off_2 }, max : { x : wall.geometry.boundingBox.max.x - off, y : wall.geometry.boundingBox.max.y - off } };
	
	
	var arrWD = {};
	if(arrWD.left && 1==2)
	{
		arrWD.left.updateMatrixWorld();
		var pos = arrWD.left.worldToLocal( wd.position.clone() );	 	
		var n = fname_s_0141(arrWD.left.geometry.vertices, pos);
		
		var pos = arrWD.left.localToWorld( arrWD.left.geometry.vertices[n].clone() );		
		
		wd.userData.door.bound.min.x = wall.worldToLocal( pos.clone() ).x + off;
	}
	

	if(arrWD.right && 1==2)
	{
		arrWD.right.updateMatrixWorld();
		var pos = arrWD.right.worldToLocal( wd.position.clone() );	 	
		var n = fname_s_0141(arrWD.right.geometry.vertices, pos);
		
		var pos = arrWD.right.localToWorld( arrWD.right.geometry.vertices[n].clone() );
		
		wd.userData.door.bound.max.x = wall.worldToLocal( pos.clone() ).x - off;
	}		
	
	wd.userData.door.last.pos = wd.position.clone();	
}





function fname_s_0140(wd)
{	
	var wall = wd.userData.door.wall;

	wall.updateMatrixWorld();
	
	var posC = wall.worldToLocal( wd.position.clone() );	
	
	var arrL = { x : 99999, o : null }, arrR = { x : 99999, o : null };
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		if(wall.userData.wall.arrO[i] == wd) continue;
		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		var x = Math.abs(v.x - posC.x); 
		
		if (v.x <= posC.x) { if(x < arrL.x) { arrL.x = x; arrL.o = wall.userData.wall.arrO[i]; } }
		else { if(x < arrR.x) { arrR.x = x; arrR.o = wall.userData.wall.arrO[i]; } }		
	}	
	
	return { left : arrL.o, right : arrR.o };
}





function fname_s_0141(v, pos)
{
	var minDist = 99999;
	var hit = 0;

	for ( var i = 0; i < v.length; i++ )
	{
		var dist = pos.distanceTo(v[i]);
		if (dist <= minDist)
		{
			minDist = dist;
			hit = i;
		}
	}	

	return hit;
}


 

function fname_s_0142( event, wd ) 
{
	if(camera == camera3D) { return; }
	
	var intersects = fname_s_0230( event, planeMath, 'one' ); 	
	if ( intersects.length > 0 ) { fname_s_0143( wd, intersects[ 0 ].point ); }	
}


var objsBSP = null;
var objClone = new THREE.Mesh();
var wallClone = new THREE.Mesh();

function fname_s_0143( wd, pos )
{
	var wall = wd.userData.door.wall;
	
	if(param_win.click)  
	{ 
		param_win.click = false; 

		wallClone.geometry = fname_s_038( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
		
		objsBSP = { wall : wallClone, wd : fname_s_039( wd ) };
		
		
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 			
	}
	
	pos = new THREE.Vector3().addVectors( wd.userData.door.offset, pos );			
	pos = wall.worldToLocal( pos.clone() );
	
	var x_min = wd.geometry.boundingBox.min.x;
	var x_max = wd.geometry.boundingBox.max.x;
	var y_min = wd.geometry.boundingBox.min.y;
	var y_max = wd.geometry.boundingBox.max.y;
	
	var bound = wd.userData.door.bound;
	
	if(pos.x + x_min < bound.min.x){ pos.x = bound.min.x - x_min; }
	else if(pos.x + x_max > bound.max.x){ pos.x = bound.max.x - x_max; }	
	
	
	if(camera != cameraTop)
	{
		if(pos.y + y_min < bound.min.y){ pos.y = bound.min.y - y_min; }
		else if(pos.y + y_max > bound.max.y){ pos.y = bound.max.y - y_max; }
	}	
	
	if(camera == cameraTop){ pos.z = 0; }	
	
	var pos = wall.localToWorld( pos.clone() );
	
	var pos2 = new THREE.Vector3().subVectors( pos, wd.position );
	
	wd.position.copy( pos );	

	wd.userData.door.h1 += pos2.y;
	
	for ( var i = 0; i < infProject.tools.controllWD.length; i++ ) { infProject.tools.controllWD[i].position.add( pos2 ); } 	
	
	fname_s_0106(wd); 	
}





function fname_s_0144( obj )
{	
	if(clickO.rayhit) 
	{
		if(clickO.rayhit.object == obj) return;	
		
		if(clickO.rayhit.object.userData.tag == 'controll_wd')
		{
			if(clickO.rayhit.object.userData.controll_wd.obj == obj) { return; }
		}		
	}		
		
	if(camera == cameraTop || camera == camera3D) 
	{ 		
		if(obj)
		{
			if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
			{
				if(camera == camera3D)
				{
					
				}
				else
				{
					for ( var i = 0; i < arrWallFront.wall.length; i++ )
					{
						arrWallFront.wall[i].obj.userData.wall.html.label[0].style.display = 'block';
						arrWallFront.wall[i].obj.userData.wall.html.label[1].style.display = 'block';
						
						arrWallFront.wall[i].obj.userData.wall.html.label[0].userData.elem.show = true;
						arrWallFront.wall[i].obj.userData.wall.html.label[1].userData.elem.show = true;						
					}					
				}
			}			
		}
	}
	
	for ( var i = 0; i < infProject.tools.controllWD.length; i++ ) { infProject.tools.controllWD[i].visible = false; }
	for ( var i = 0; i < infProject.scene.size.wd_1.line.length; i++ ) 
	{ 
		var line = infProject.scene.size.wd_1.line[i];
		line.visible = false; 
		for ( var i2 = 0; i2 < line.userData.rulerwd.cone.length; i2++ )
		{
			line.userData.rulerwd.cone[i2].visible = false; 
		}	
	}
	
	for ( var i = 0; i < infProject.html.wd.length; i++ )
	{ 
		infProject.html.wd[i].style.display = 'none'; 
		infProject.html.wd[i].userData.elem.show = false;
	}
}



function fname_s_0145(wd)
{			
	wd.geometry.computeBoundingBox();
	
	var minX = wd.geometry.boundingBox.min.x;
	var maxX = wd.geometry.boundingBox.max.x;
	var minY = wd.geometry.boundingBox.min.y;
	var maxY = wd.geometry.boundingBox.max.y;

	var d1 = Math.abs( maxX - minX );		
	var d2 = Math.abs( maxY - minY );			
	
	$('[nameId="size-wd-length"]').val(Math.round(d1 * 100) / 100);
	$('[nameId="size-wd-height"]').val(Math.round(d2 * 100) / 100);
	$('[nameId="rp_wd_h1"]').val(Math.round((wd.userData.door.h1 + minY) * 100) / 100);
}




function fname_s_0146(wd)
{  
	if(!wd) return;
	if(wd.userData.tag == 'window' || wd.userData.tag == 'door'){}
	else { return; }
	
	var wall = wd.userData.door.wall;
	
	var x = $('[nameId="size-wd-length"]').val();		
	var y = $('[nameId="size-wd-height"]').val();		
	var h = $('[nameId="rp_wd_h1"]').val();				
	
	
	
	wd.geometry.computeBoundingBox();
	var x2 = (Math.abs(wd.geometry.boundingBox.max.x) + Math.abs(wd.geometry.boundingBox.min.x));
	var y2 = (Math.abs(wd.geometry.boundingBox.max.y) + Math.abs(wd.geometry.boundingBox.min.y));
	var h2 = wd.userData.door.h1 + wd.geometry.boundingBox.min.y;	
		
	var resX = fname_s_0245({ value: x, unit: 1, limit: {min: 0.1, max: 5} });
	var resY = fname_s_0245({ value: y, unit: 1, limit: {min: 0.1, max: 5} });
	var resH = fname_s_0245({ value: h, unit: 1, limit: {min: 0, max: 5} });
	
	x = (!resX) ? x2 : resX.num;
	y = (!resY) ? y2 : resY.num;	 
	h = (!resH) ? h2 : resH.num;
	
	
	wd.userData.door.h1 = h - wd.geometry.boundingBox.min.y;    
	
	var pos = wd.position.clone(); 
	pos.y = wd.userData.door.h1; 
	
	сhangeSizePosWD( wd, pos, x, y );	
	
	wallClone.geometry = fname_s_038( wd ).geometry.clone(); 
	wallClone.position.copy( wd.userData.door.wall.position ); 
	wallClone.rotation.copy( wd.userData.door.wall.rotation );		

	fname_s_040( wd, { wall : wallClone, wd : fname_s_039( wd ) } ); 	
	
	wd.updateMatrixWorld();
	
	fname_s_0105(wd);	
	fname_s_0145(wd);	
	
	renderCamera();
}





function сhangeSizePosWD( wd, pos, x, y )
{	
	var v = wd.geometry.vertices;
	var v2 = wd.userData.door.form.v2;
	var size = wd.userData.door.form.size;
	
	var scale = new THREE.Vector3(x/size.x, y/size.y, 1);	
	
	for ( var i = 0; i < v2.length; i++ )
	{
		v[i].x = v2[i].x * scale.x;
		v[i].y = v2[i].y * scale.y;
		
	}		

	wd.geometry.verticesNeedUpdate = true;
	wd.geometry.elementsNeedUpdate = true;	
	wd.geometry.computeBoundingSphere();

	wd.position.copy( pos );
	
	 
	
	if(wd.userData.door.objPop)
	{
		wd.updateMatrixWorld();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeBoundingSphere();
		var x = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
		var y = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;		
		
		var objPop = wd.userData.door.objPop;
		
		objPop.geometry.computeBoundingBox();		
		var dX = objPop.geometry.boundingBox.max.x - objPop.geometry.boundingBox.min.x;
		var dY = objPop.geometry.boundingBox.max.y - objPop.geometry.boundingBox.min.y;				
		
		objPop.scale.set(x/dX, y/dY, 1);			
	}	
}





function fname_s_0147(wd)
{
	if(param_win.click) { param_win.click = false; return; }
	
	fname_s_040( wd, objsBSP );
	 
	if(camera == cameraTop)
	{ 
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		wd.material.depthTest = true;
		wd.material.transparent = true;
		wd.material.opacity = 0;					
	}	

	
}




function fname_s_0148()
{
	var obj = clickO.last_obj;
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(camera == camera3D)
	{
		if ( tag == 'wall' ) return;
	}
	else if(camera == cameraWall)
	{
		if ( tag == 'wall' ) return;
	}	
		
	if ( tag == 'wall' ) { fname_s_0149( obj ).room; }
	else if ( tag == 'point' ) { if(obj.p.length == 2) { fname_s_0153( obj ); } }
	else if ( tag == 'window' || tag == 'door' ) { fname_s_0154( obj ); }
	else if ( tag == 'obj' ) { fname_s_0260({obj: obj}); }
	
	 renderCamera();
}


function fname_s_0149( wall )
{	
	fname_s_080(wall);
	
	var points = wall.userData.wall.p;

	var arrZone = fname_s_0183( wall );
	var oldZ = fname_s_0162(arrZone);
	fname_s_0176(arrZone); 
	
	var zone = (arrZone.length == 0) ? fname_s_048( wall ).obj : null; 
	
	fname_s_0150(wall);
	
	var newZones = [];
	
	
	if(oldZ.length > 0) 
	{ 
		var area = oldZ[0].floor.userData.room.areaTxt;
		var n = 0;
		for ( var i = 0; i < oldZ.length; i++ ) { if(oldZ[i].floor.userData.room.areaTxt > area) { n = i; } }
		
		newZones = fname_s_0166();

		if(newZones.length > 0) { fname_s_0182([newZones[0]], oldZ[n], false); } 
	}
	else
	{	
		if(zone) { fname_s_046([zone]); }				
	}

	return { room : newZones }; 
}



function fname_s_0150(wall)
{
	fname_s_0187();
	
	var arr = wall.userData.wall.arrO;

	for(var i = 0; i < arr.length; i++)
	{
		if(arr[i].userData.tag == 'window') { fname_s_0155({arr : infProject.scene.array.window, o : arr[i]}); }
		if(arr[i].userData.tag == 'door') { fname_s_0155({arr : infProject.scene.array.door, o : arr[i]}); }
		scene.remove( arr[i] );
	}

	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1]; 
	fname_s_0156(p0, wall);
	fname_s_0156(p1, wall);
	fname_s_0155({arr : infProject.scene.array.wall, o : wall});;
	
	
	for ( var i = 0; i < wall.userData.wall.html.label.length; i++ )
	{
		fname_s_0155({arr: infProject.html.label, o: wall.userData.wall.html.label[i]});
		wall.userData.wall.html.label[i].remove();
	}
	 
	scene.remove( wall );
	
	if(p0.w.length == 0){ fname_s_0157( p0 ); scene.remove( p0 ); }
	if(p1.w.length == 0){ fname_s_0157( p1 ); scene.remove( p1 ); }


	var arrW = [];
	for ( var i = 0; i < p0.w.length; i++ ) { arrW[arrW.length] = p0.w[i]; }
	for ( var i = 0; i < p1.w.length; i++ ) { arrW[arrW.length] = p1.w[i]; }  
	fname_s_041( arrW );	
	
	if(p0.w.length > 0){ fname_s_0122(p0); }
	if(p1.w.length > 0){ fname_s_0122(p1); }

	fname_s_044(arrW);
	
	fname_s_042( arrW );
}



function fname_s_0151(wall, cdm)
{
	if(!cdm) { cdm = {}; }
	if(!cdm.dw) { cdm.dw = ''; }
	
	fname_s_0187();
	
	if(cdm.dw == 'no delete') {}
	else
	{
		var arr = wall.userData.wall.arrO;
		
		for(var i = 0; i < arr.length; i++)
		{
			if(arr[i].userData.tag == 'window') { fname_s_0155({arr : infProject.scene.array.window, o : arr[i]}); }
			if(arr[i].userData.tag == 'door') { fname_s_0155({arr : infProject.scene.array.door, o : arr[i]}); }
			scene.remove( arr[i] );
		}		
	}

	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1]; 
	fname_s_0156(p0, wall);
	fname_s_0156(p1, wall);
	fname_s_0155({arr : infProject.scene.array.wall, o : wall});;
	
	for ( var i = 0; i < wall.userData.wall.html.label.length; i++ )
	{
		fname_s_0155({arr: infProject.html.label, o: wall.userData.wall.html.label[i]});
		wall.userData.wall.html.label[i].remove();
	}	
	
	
	scene.remove( wall );
	
	if(p0.w.length == 0){ fname_s_0157( p0 ); scene.remove( p0 ); }
	if(p1.w.length == 0){ fname_s_0157( p1 ); scene.remove( p1 ); }

}



function fname_s_0152( point )
{
	fname_s_0157(point); 
	scene.remove(point);
}


function fname_s_0153( point )
{
	if(!point){ return [ null, null ]; }
	if(point.p.length != 2){ return [ null, null ]; }
	
	fname_s_080(point);
	
	var wall_1 = point.w[0];
	var wall_2 = point.w[1];
		
	var arrW_2 = fname_s_0118([], point);
	
	fname_s_041( arrW_2 );
	 
	var point1 = point.p[0];
	var point2 = point.p[1];
	
	var p1 = { id : point1.userData.id, pos : point1.position.clone() };
	var p2 = { id : point2.userData.id, pos : point2.position.clone() };	

	var dir1 = new THREE.Vector3().subVectors( point.position, point1.position ).normalize();
	var dir2 = new THREE.Vector3().subVectors( point2.position, point.position ).normalize();
	
	var d1 = wall_1.userData.wall.p[0].position.distanceTo( wall_1.userData.wall.p[1].position );
	var d2 = wall_2.userData.wall.p[0].position.distanceTo( wall_2.userData.wall.p[1].position );
	
	var wall = (d1 > d2) ? wall_1 : wall_2;	
	var res = (d1 > d2) ? 1 : 2;
	
	
	
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material;
	var userData_material = wall.userData.material;
	
	
	if(res == 1)
	{
		if(point.start[0] != 1)		
		{
			material = [wall.material[0], wall.material[2], wall.material[1], wall.material[3]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1], wall.userData.material[3]];			
		}
	}
	if(res == 2)
	{
		if(point.start[1] != 0)
		{
			material = [wall.material[0], wall.material[2], wall.material[1], wall.material[3]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1], wall.userData.material[3]];			
		}
	}	
	
	
	var arrO = [];
	for ( var i = 0; i < wall_1.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_1.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}

	for ( var i = 0; i < wall_2.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_2.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}
	
	var oldZones = fname_s_0183( wall_1 );   	
	var oldZ = fname_s_0162( oldZones );
	fname_s_0176( oldZones );						

	
	fname_s_0151( wall_1 );		
	fname_s_0151( wall_2 );		
	 

	
	var point1 = fname_s_0242( 'point', p1.id );
	var point2 = fname_s_0242( 'point', p2.id );	
	
	if(point1 == null) { point1 = fname_s_0226( p1.pos, p1.id ); }
	if(point2 == null) { point2 = fname_s_0226( p2.pos, p2.id ); }	
	
	var wall = fname_s_0227({ p: [point1, point2], width: width, offsetZ : offsetZ, height : height }); 

	fname_s_0122(point1);
	fname_s_0122(point2);
	
	var arrW = [];
	for ( var i = 0; i < arrW_2.length; i++ ) { arrW[arrW.length] = arrW_2[i]; }
	arrW[arrW.length] = wall;
	
	fname_s_044( arrW );	
	
	var newZones = fname_s_0166();		
	fname_s_0180(oldZ, newZones, 'delete');		
	
	
	
	if(fname_s_021(dir1, dir2)) 
	{
		for ( var i = 0; i < arrO.length; i++ ) { arrO[i].wall = wall; } 
	}
	
	
	wall.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ]; 
	wall.userData.material = userData_material; 
	
	fname_s_042( arrW );
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false; 
	
	return { point : { id : point.userData.id }, wall : wall }; 
} 




function fname_s_0154( obj )
{	
	var wall = obj.userData.door.wall; 		
	
	fname_s_038( obj );		
		
	fname_s_0155({arr : wall.userData.wall.arrO, o : obj});	
	
	if(obj.userData.tag == 'window') { fname_s_080(obj); }
	if(obj.userData.tag == 'door') { fname_s_080(obj); }
	
	clickO = resetPop.clickO();
	fname_s_0144( obj ); 
	
	
	if(obj.userData.cubeCam)
	{
		fname_s_0155({arr : infProject.scene.array.cubeCam, o : obj.userData.cubeCam});
		fname_s_0192( obj.userData.cubeCam );
		scene.remove( obj.userData.cubeCam );			
	}
	
	
	if(obj.userData.tag == 'window') { fname_s_0155({arr : infProject.scene.array.window, o : obj}); }
	if(obj.userData.tag == 'door') { fname_s_0155({arr : infProject.scene.array.door, o : obj}); }
	
	fname_s_0192( obj );
	scene.remove( obj );	
}







function fname_s_0155(cdm)
{
	var arr = cdm.arr;
	var o = cdm.o;
	
	for(var i = arr.length - 1; i > -1; i--) { if(arr[i] == o) { arr.splice(i, 1); break; } }
}



function fname_s_0156(point, wall)
{
	var n = -1;
	for ( var i = 0; i < point.w.length; i++ ){ if(point.w[i].userData.id == wall.userData.id) { n = i; break; } }
	
	point.p.splice(n, 1);
	point.w.splice(n, 1);
	point.start.splice(n, 1);	
}





function fname_s_0157(point)
{
	var n = -1;
	for ( var i = 0; i < obj_point.length; i++ ){ if(obj_point[i].userData.id == point.userData.id) { n = i; break; } }
		
	obj_point.splice(n, 1);	
}







function fname_s_0158(cdm)
{	
	var arrP = cdm.point;
	var arrW = cdm.wall;
	var arrS = cdm.side;
	var id = (cdm.id) ? cdm.id : null;
	var material = (cdm.material) ? cdm.material : null;
	
	var point_room = [];
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		point_room[i] = new THREE.Vector2 ( arrP[i].position.x, arrP[i].position.z );		
	}	 
	
	var shape = new THREE.Shape( point_room );
	var geometry = new THREE.ShapeGeometry( shape );
	
	var n = room.length;	
	
	var color = 0xe3e3e5;
	
	if(infProject.settings.floor.color){ color = infProject.settings.floor.color; }
	
	var material =new THREE.MeshPhongMaterial( { color : color, lightMap : lightMap_1, dithering: true } );
	
	var floor = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: infProject.settings.floor.height } ), material ); 
	room[n] = floor;
	
	floor.position.set( 0, infProject.settings.floor.posY, 0 );
	floor.rotation.set( Math.PI / 2, 0, 0 );	
	floor.p = arrP;
	floor.w = arrW; 
	floor.s = arrS;	
	
	
	if(!id) { id = countId; countId++; }  
	 
	floor.userData.tag = 'room';
	floor.userData.id = id;
	floor.userData.room = {};
	floor.userData.room.areaTxt = 0;
	floor.userData.room.p = floor.p;
	floor.userData.room.w = floor.w;
	floor.userData.room.s = floor.s;
	floor.userData.room.zone = { id: 0, name: '' };
	floor.userData.room.zone.id = undefined;
	floor.userData.room.contour = [];
	floor.userData.room.height = infProject.settings.floor.height;
	floor.userData.room.html = {};
	floor.userData.room.html.label = null; 
	floor.userData.material = { tag: 'room', color: floor.material.color, img: null };	
	
	var ceil = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color : 0xffffff, lightMap : lightMap_1, dithering: true } ) );
	ceiling[n] = ceil;
	
	ceil.position.set( 0, arrP[0].position.y + infProject.settings.height, 0 );  
	ceil.rotation.set( Math.PI / 2, 0, 0 );		
	ceil.userData.tag = 'ceiling';
	ceil.userData.id = id;
	ceil.userData.material = { tag: 'ceiling', color: ceil.material.color, img: null };


	
	cdm.material = { img: infProject.path+"img/load/floor_1.jpg" };
	
	if(cdm.material)
	{  
		fname_s_0231({obj: floor, material: cdm.material});	
	}
	
	if(infProject.settings.floor.o)
	{ 	
		floor.userData.room.html.label = fname_s_0333({count: 1, display: 'none', tag: 'elem_type_room'})[0]; 
		
		if(infProject.settings.floor.label.visible) 
		{ 
			
		} 
			
		fname_s_046([floor]); 
		scene.add(floor); 
		scene.add(ceil);		
	}
	else
	{
		fname_s_044(arrW); 
	}

	
	for ( var i = 0; i < arrW.length; i++ ) 
	{ 
		var ind = (arrS[i] == 0) ? 2 : 1; 
		arrW[i].userData.wall.room.side2[ind] = floor; 
	}	
	
	fname_s_0159(arrP, floor);
	
	floor.castShadow = true; 
	floor.receiveShadow = true;
	ceil.castShadow = true; 
	ceil.receiveShadow = true;	
	
	return floor;
}






function fname_s_0159(arrP, zone)
{
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		var k1 = (i == 0) ? arrP.length - 2 : i - 1;				
		var f = arrP[i].zone.length;
		arrP[i].zone[f] = zone; 
		arrP[i].zoneP[f] = arrP[k1]; 		
	}		
}




function fname_s_0160(zone, newPoint, replacePoint)
{
	for ( var i = 0; i < zone.length; i++ )  
	{  		
		for ( var i2 = 0; i2 < zone[i].p.length; i2++ )
		{
			if(zone[i].p[i2] == replacePoint) { zone[i].p[i2] = newPoint; }
		}			
	}			
}





function fname_s_0161(arrRoom)
{  
	if(!infProject.settings.floor.o) { return; }
	
	for ( var i = 0; i < arrRoom.length; i++ ) 
	{	 
		var point = [];
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ ) { point[i2] = new THREE.Vector2 ( arrRoom[i].p[i2].position.x, arrRoom[i].p[i2].position.z ); }				
		
		var shape = new THREE.Shape( point );				

		var geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: infProject.settings.floor.height } ); 
				
		arrRoom[i].geometry.vertices = geometry.vertices;
		arrRoom[i].geometry.faces = geometry.faces;		
		arrRoom[i].geometry.verticesNeedUpdate = true;
		arrRoom[i].geometry.elementsNeedUpdate = true;
		
		arrRoom[i].geometry.computeBoundingSphere();
		arrRoom[i].geometry.computeBoundingBox();
		arrRoom[i].geometry.computeFaceNormals();
		
		geometry.dispose();
		
		arrRoom[i].position.y = infProject.settings.floor.posY;
		fname_s_0235( arrRoom[i] );
		fname_s_046([arrRoom[i]]); 

		
		var num = 0;		
		for ( var i2 = 0; i2 < room.length; i2++ ) { if(room[i2].userData.id == arrRoom[i].userData.id) { num = i2; break; } }	
		
		var geometry = new THREE.ShapeGeometry( shape );
		
		ceiling[num].geometry.vertices = geometry.vertices;
		ceiling[num].geometry.faces = geometry.faces;			
		ceiling[num].geometry.verticesNeedUpdate = true;
		ceiling[num].geometry.elementsNeedUpdate = true;
		
		ceiling[num].geometry.computeBoundingSphere();
		ceiling[num].geometry.computeBoundingBox();
		ceiling[num].geometry.computeFaceNormals();

		geometry.dispose();
	}
	
	
}




function fname_s_0162(arr) 
{
	var arrN = [];
	if(!Array.isArray(arr)) { var res = arr; var arr = [res]; }
	
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(room[i2] == arr[i]) { arrN[i] = { floor : room[i2], ceiling : ceiling[i2] }; break; }
		}		
	}	
	
	return arrN;
}




function fname_s_0163(cdm) 
{
	var result = null;
	var obj = cdm.obj;
	
	if(obj.userData.tag == 'room')
	{
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(room[i2] == obj) { result = { floor: room[i2], ceiling: ceiling[i2] }; break; }
		}		
	}
	else if(obj.userData.tag == 'ceiling')
	{
		for ( var i2 = 0; i2 < ceiling.length; i2++ )
		{
			if(ceiling[i2] == obj) { result = { floor: room[i2], ceiling: ceiling[i2] }; break; }
		}			
	}
	else 
	{
		return;
	}	
	
	return result;
}




function fname_s_0164()
{
	var shape = new THREE.Shape( [new THREE.Vector2(-2, 1), new THREE.Vector2(2, 1), new THREE.Vector2(2, -1), new THREE.Vector2(-2, -1)] );
	var geometry = new THREE.ShapeGeometry( shape );

	var plane = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0x0000ff, transparent: true, opacity: 0 } ) );
	plane.position.set( 0, infProject.settings.floor.posY, 0 );
	plane.rotation.set( -Math.PI / 2, 0, 0 );
	scene.add(plane);

	return plane;
}


function fname_s_0165(cdm)
{
	var obj = cdm.obj;
	
	var contour = obj.userData.room.contour;
	var contour2 = [];
	
	for(var i = 0; i < contour.length; i++)
	{
		contour2[i] = new THREE.Vector2(contour[i].x, -contour[i].z);
	}

	
	var plane = infProject.tools.floorPl;	
	plane.geometry.dispose();
	plane.geometry = new THREE.ShapeGeometry( new THREE.Shape(contour2) );	
	fname_s_0207({arr: [plane]});
	 
	fname_s_029({obj: obj});
}









function fname_s_0166()
{		
	var arrRoom = [];
	
	for ( var i = 0; i < obj_point.length; i++ )
	{			
		if(obj_point[i].p.length < 2){ continue; }

		for ( var i2 = 0; i2 < obj_point[i].p.length; i2++ )
		{
			if(obj_point[i].p[i2].p.length < 2){ continue; }									
			
			

			var p = fname_s_0169([obj_point[i]], obj_point[i].p[i2]); 		
			 
			
			if(p[0] != p[p.length - 1]){ continue; }	
			if(p.length > 5){ if(p[1] == p[p.length - 2]) continue; }
			if(fname_s_047(p) <= 0){ continue; }		
			if(fname_s_0167( obj_point[i].zone, p )){ continue; }
								
			 
			var arr = fname_s_0170(p);						
			
			arrRoom[arrRoom.length] = fname_s_0158({point : p, wall : arr[0], side : arr[1]});			
			break; 
		}
	}

	return arrRoom;
}







function fname_s_0167( arrRoom, arrP )
{
	var flag = false;
	
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		var ln = 0;
		
		if(arrRoom[i].p.length != arrP.length) { continue; }
			
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ )
		{
			for ( var i3 = 0; i3 < arrP.length - 1; i3++ )
			{
				if(arrRoom[i].p[i2] == arrP[i3]) { ln++; }
			}
		}
		
		if(ln == arrP.length - 1) 
		{ 
			
			
			
			flag = true; 
			break; 
		}
	}
	
	return flag;
}





 


function fname_s_0168(p1, p2)
{
	for ( var i = 0; i < p1.zone.length; i++ )
	{
		for ( var i2 = 0; i2 < p2.zone.length; i2++ )
		{
			if(p1.zone[i] == p2.zone[i2]) 
			{ 
				if(p1 == p2.zoneP[i2]){ return true; } 
				if(p1.zoneP[i] == p2){ return true; }
			}
		}
	}
	
	return false;	
}






function fname_s_0169(arr, point)
{
	var p2 = arr[arr.length - 1];
	arr[arr.length] = point;
	
	
	var dir1 = new THREE.Vector3().subVectors( point.position, p2.position ).normalize();	
	
	var arrD = [];
	var n = 0;
	for ( var i = 0; i < point.p.length; i++ )
	{
		if(point.p[i] == p2){ continue; }		
		if(point.p[i].p.length < 2){ continue; }
		
		var dir2 = new THREE.Vector3().subVectors( point.p[i].position, point.position ).normalize();
		
		arrD[n] = [];
		arrD[n][1] = point.p[i];
		
		var d = (point.p[i].position.x - p2.position.x) * (point.position.z - p2.position.z) - (point.p[i].position.z - p2.position.z) * (point.position.x - p2.position.x);
		
		var angle = dir1.angleTo( dir2 );
		
		if(d > 0){ angle *= -1; }
		
		arrD[n][0] = angle;
		if(!fname_s_06(angle)) { return arr; }
		
		
		n++;
	}	
	
	
	if(arrD.length > 0)
	{ 
		arrD.sort(function (a, b) { return a[0] - b[0]; });
		
		for ( var i = 0; i < arrD.length; i++ )
		{			
			if(arr[0] != arrD[i][1]) { return fname_s_0169(arr, arrD[i][1]); }
			else { arr[arr.length] = arrD[i][1]; break; }						
		}
	}
	
	return arr;
}




 

function fname_s_0170(p)
{
	var w = [];  
	var s = [];
	
	for ( var i = 0; i < p.length - 1; i++ )
	{ 		
		for ( var y1 = 0; y1 < p[i].w.length; y1++ )
		{
			for ( var y2 = 0; y2 < p[i + 1].w.length; y2++ )
			{
				if(p[i].w[y1] == p[i + 1].w[y2])
				{
					w[i] = p[i].w[y1];
					s[i] = p[i].start[y1];
					continue;
				}
			}
		}
	}	
	
	return [w, s];			
}









function fname_s_0171( point, obj, arrRoom, num, cdm )
{
	fname_s_0177(arrRoom);		
	fname_s_0172(cdm, arrRoom, num, point); 				
	
	for ( var i = 0; i < arrRoom.length; i++ ) { fname_s_0173(arrRoom[i], num[i], point, cdm); }	
	
	if(obj.userData.tag == 'wall'){ var arr = fname_s_0119(obj); }
	else if(obj.userData.tag == 'point'){ var arr = fname_s_0118([], obj); }

	fname_s_044(arr);				
	fname_s_0161(arrRoom);		
}

 



function fname_s_0172(cdm, arrRoom, numS, point)
{
	var zone = arrRoom;
	var num = numS;
	
	if(cdm.name == 'join')
	{
		zone = cdm.zone;
		num = cdm.num; 
		cdm = 'del';
	}
	
	for ( var i = 0; i < zone.length; i++ )
	{
		if(cdm == 'add') 			
		{ 
			zone[i].p.splice(num[i], 0, point); 
		}		
		else if(cdm == 'del') 		
		{ 				
			if(num[i] == 0 || num[i] == zone[i].p.length - 1)	
			{
				zone[i].p.splice(0, 1);	
				zone[i].p.splice(zone[i].p.length - 1, 1);			
				zone[i].p[zone[i].p.length] = zone[i].p[0];
			}
			else { zone[i].p.splice(num[i], 1); }		
		}		
	}
}






function fname_s_0173(zoneIndex, num, point, cdm)
{		
	var arr = fname_s_0170(zoneIndex.p);	
	
	fname_s_0159(zoneIndex.p, zoneIndex);	
				
	zoneIndex.w = arr[0]; 		
	zoneIndex.s = arr[1];	
}





function fname_s_0174(point1, point2)
{
	for ( var i = 0; i < point2.zone.length; i++ )
	{ 
		var flag = false;
		for ( var i2 = 0; i2 < point1.zone.length; i2++ )
		{			
			if(point2.zone[i] == point1.zone[i2]) { flag = true; break; }
		}
		if(!flag) { return true; }
	}
	
	return false;
}


function fname_s_0175(point1, point2) 
{
	var arr = [];
	
	for ( var i = 0; i < point2.zone.length; i++ )
	{ 
		var flag = false;
		for ( var i2 = 0; i2 < point1.zone.length; i2++ )
		{			
			if(point2.zone[i] == point1.zone[i2]) { flag = true; break; }
		}
		if(!flag) { arr[arr.length] = point2.zone[i]; }
	}
	
	return arr;
}

 

function fname_s_0176(arrRoom)
{
	var roomType = [];
	var arrN = [];
	
	
	
	for(var i = 0; i < arrRoom.length; i++)
	{
		for(var i2 = 0; i2 < arrRoom[i].userData.room.w.length; i2++)
		{
			var wall = arrRoom[i].userData.room.w[i2];
			
			if(wall.userData.wall.room.side2[1] == arrRoom[i]){ wall.userData.wall.room.side2[1] = null; }
			else if(wall.userData.wall.room.side2[2] == arrRoom[i]){ wall.userData.wall.room.side2[2] = null; }
		}
	}
	
	
	
	for ( var i = 0; i < room.length; i++ ) 
	{
		for ( var i2 = 0; i2 < arrRoom.length; i2++ ) 
		{ 
			if(room[i] == arrRoom[i2])
			{  				 
				arrN[arrN.length] = i; break;
			}
		}
	}

	fname_s_0177(arrRoom);
	
	for ( var i = arrN.length - 1; i >= 0; i-- )
	{
		roomType[roomType.length] = 
		{ 
			nameTxt : room[arrN[i]].userData.room.roomType,  
			material : room[arrN[i]].material, 
			userData : room[arrN[i]].userData, 
			area : Number(room[arrN[i]].userData.room.areaTxt), 
		}; 
		
		var floor = room[arrN[i]];    			
		room.splice(arrN[i], 1); 
		
		var ceil = ceiling[arrN[i]];
		ceiling.splice(arrN[i], 1);	 
		
		
		fname_s_0155({arr: infProject.html.label, o: floor.userData.room.html.label});
		floor.userData.room.html.label.remove();
	
		fname_s_0192( floor );
		fname_s_0192( ceil );		
		
		scene.remove( floor );
		scene.remove( ceil );		
	}
	
	return roomType;
}




function fname_s_0177(arrRoom)
{
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		for ( var i2 = 0; i2 < arrRoom[i].p.length; i2++ )
		{
			for ( var i3 = 0; i3 < arrRoom[i].p[i2].zone.length; i3++ )
			{
				if(arrRoom[i].p[i2].zone[i3] == arrRoom[i])
				{ 
					arrRoom[i].p[i2].zone.splice(i3, 1);
					arrRoom[i].p[i2].zoneP.splice(i3, 1); 
					break;
				}							
			}
		}
	}
}




function fname_s_0178( arrRoom, arrP )
{
	var flag = false;
	var ln = 0;
	
	if(arrRoom.p.length - 1 != arrP.length) { return flag; }
		
	for ( var i2 = 0; i2 < arrRoom.p.length - 1; i2++ )
	{
		for ( var i3 = 0; i3 < arrP.length; i3++ )
		{
			if(arrRoom.p[i2].userData.id == arrP[i3]) { ln++; }
		}
	}
	
	if(arrRoom.p.length - 1 == ln) 
	{ 
		
		
		
		flag = true; 
	}
	
	return flag;
}





function fname_s_0179(cdm) 
{	
	var ray = new THREE.Raycaster();
	ray.set( new THREE.Vector3(cdm.pos.x, 1, cdm.pos.z), new THREE.Vector3(0, -1, 0) );
	
	var intersects = ray.intersectObject( cdm.obj );	
	
	var floor = (!intersects[0]) ? null : intersects[0].object;				
	
	return { o: floor };
}





function fname_s_0180( oldZ, newZones, cdm ) 
{
	
	for ( var i = 0; i < newZones.length; i++ ) 
	{
		for ( var i2 = 0; i2 < oldZ.length; i2++ ) 
		{ 			
			var oldZones = oldZ[i2].floor; 
			var count = 0;
			
			for ( var i3 = 0; i3 < newZones[i].p.length - 1; i3++ )
			{
				for ( var i4 = 0; i4 < oldZones.p.length - 1; i4++ )
				{
					if(newZones[i].p[i3].userData.id == oldZones.p[i4].userData.id) { count++; break; };
				}				
			}

			
			if(cdm == 'add') { var countNew = newZones[i].p.length - 2; }
			else if(cdm == 'delete') { var countNew = newZones[i].p.length - 1; }
			else if(cdm == 'copy') { var countNew = newZones[i].p.length - 1; }
			
			if(countNew == count)
			{
				fname_s_0182([newZones[i]], oldZ[i2], false);				
				break;
			}			
		}
	}

}






function fname_s_0181(wall) 
{
	var oldZone = fname_s_048( wall ).obj;
	var oldZ = fname_s_0162(oldZone);
	
	if(oldZone) { fname_s_0176( [oldZone] ); }			
		
	var newZones = fname_s_0166();			
	 
	if(oldZone) { fname_s_0182(newZones, oldZ[0], true); } 
}



function fname_s_0182(newZones, oldZ, addId)
{
	var newZ = fname_s_0162(newZones);
	
	for ( var i = 0; i < newZ.length; i++ )
	{	 
		var floor = newZ[i].floor;		
		var ceiling = newZ[i].ceiling;
		
		floor.userData.id = oldZ.floor.userData.id;	
		floor.userData.material = Object.assign({}, oldZ.floor.userData.material);		
		floor.material = oldZ.floor.material.clone();
		

		ceiling.userData.id = oldZ.ceiling.userData.id;	
		ceiling.userData.material = Object.assign({}, oldZ.ceiling.userData.material);
		ceiling.material = oldZ.ceiling.material.clone();
		
		if(addId) 
		{ 
			floor.userData.id = countId; countId++; 
			ceiling.userData.id = countId; countId++;
		}  
		fname_s_046( [floor] );
	}
}





function fname_s_0183( wall )
{
	var arrRoom = [];	
	for ( var i = 0; i < wall.userData.wall.p[0].zone.length; i++ ) 
	{
		for ( var i2 = 0; i2 < wall.userData.wall.p[1].zone.length; i2++ )
		{
			if(wall.userData.wall.p[0].zone[i] == wall.userData.wall.p[1].zone[i2])
			{
				arrRoom[arrRoom.length] = wall.userData.wall.p[0].zone[i]; 
			}
		}
	}

	return arrRoom;
}









function fname_s_0184( event )
{
	if (camera != cameraTop) { return; }
	if (isMouseDown1) { return; }

	if ( clickO.move ) 
	{
		var tag = clickO.move.userData.tag;
		
		if (tag == 'free_dw') { return; }
		if (tag == 'point') { if (clickO.move.userData.point.type) return; }		
	}
	
	var rayhit = null;
		
	

	if(!infProject.scene.block.hover.point)
	{
		var ray = fname_s_0230( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	

	if ( rayhit ) 
	{
		
		var object = rayhit.object;
		var tag = object.userData.tag; 				

		
		if ( clickO.hover == object ) { return; }				


		if ( tag == 'point' ) 
		{ 
			
			object.material.opacity = 1;
			$('html,body').css('cursor', 'move');
		}

		
		fname_s_0185();

		clickO.hover = object;
	}
	else
	{
		fname_s_0185();
	}
}




function fname_s_0185()
{
	if ( !clickO.hover ) { return; }

	var object = clickO.hover;
	var tag = object.userData.tag;  	
	
	if( tag == 'point' ) 
	{ 
		
		object.material.opacity = 0.75;
		$('html,body').css('cursor', 'default');
	}
	
	clickO.hover = null;
}







function fname_s_0186(obj)
{ 
	if(camera != cameraTop) return;
	if(!obj) { return; }   
	if(clickO.last_obj == obj) { return; }
			
	var tag = obj.userData.tag;
	
	if(tag == 'window'){ fname_s_0207({arr: [obj]}); }
	else if(tag == 'point'){ fname_s_0207({arr: [obj]}); }	 
	else if(tag == 'wall'){ fname_s_0207({arr: [obj]}); } 	
	else if(tag == 'door'){ fname_s_0207({arr: [obj]}); }	
	
	
	
}
 

	
 

function fname_s_0187() 
{	
	if(camera != cameraTop) return;
	if(!clickO.last_obj){ return; }
	if(clickO.last_obj == clickO.obj){ return; }
	
	var o = clickO.last_obj;	

	if(clickO.rayhit)
	{    
		if(clickO.rayhit.object.userData.tag == 'controll_wd'){ if(clickO.rayhit.object.userData.controll_wd.obj == o) { return; } }      		
	}
	 
	if(o.userData.tag == 'wall'){ fname_s_0208(); fname_s_045({wall: o}); }	
	else if(o.userData.tag == 'point'){ fname_s_0208(); }	
	else if(o.userData.tag == 'window'){ fname_s_0208(); }
	else if(o.userData.tag == 'door'){ fname_s_0208(); }	
	
	if(clickO.hover == clickO.last_obj) { clickO.hover = null; }
} 













function fname_s_0188(href) 
{
	var url = new URL(href); 
	var url = url.searchParams.get('file');  
	if(url) { fname_s_0197(url); }
}



var resetPop =
{


	fileInfo : function()
	{
		return { last : {cam : { obj : camera, type : '', pos : new THREE.Vector3(), rot : new THREE.Vector3() }} };
	},
	
	infProjectSceneArray : function()
	{
		var array = { point: obj_point, wall: [], window: [], door: [], floor: room, ceiling: ceiling, obj: [], objSpot: [] };
		array.cubeCam = [];
		array.lineGrid = { limit : false };
		array.base = (infProject.start)? infProject.scene.array.base : [];	
		
		return array;
	},

	listColor : function()
	{	
		var array = {};
		
		array.door2D = 'rgb(224, 224, 224)';
		array.window2D = 'rgb(224, 224, 224)';
		array.active2D = 'rgb(255, 162, 23)';
		array.hover2D = 'rgb(69, 165, 58)';

		return array;
	},
	
	clickO : function()
	{
		var inf = { obj: null, last_obj: null, hover: null, rayhit : null, button : null, buttonAct : null };
		inf.down = null;
		inf.move = null;
		inf.up = null;
		inf.offset = new THREE.Vector3();
		inf.actMove = false;
		inf.pos = { clickDown : new THREE.Vector3() };
		inf.click = { wall : [], point : [], side_wall: 0 };
		inf.selectBox = { arr : [], drag : false, move : false };
		inf.keys = [];
		inf.options = null;
		inf.elem = null;
		
		return inf;
	},
	
	active : function()
	{
		var inf = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true, unlock : true };
		
		return inf;
	}	
};



function fname_s_0189() 
{	
	fname_s_080(clickO.last_obj);
	
	
	var wall = infProject.scene.array.wall;
	var point = infProject.scene.array.point;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	var obj = infProject.scene.array.obj;
	var floor = infProject.scene.array.floor;
	var ceiling = infProject.scene.array.ceiling;
	var cubeCam = infProject.scene.array.cubeCam;
	
	for ( var i = 0; i < wall.length; i++ )
	{ 		
		fname_s_0155({arr: infProject.html.label, o: wall[i].userData.wall.html.label[0]});
		fname_s_0155({arr: infProject.html.label, o: wall[i].userData.wall.html.label[1]});
		
		wall[i].userData.wall.html.label[0].remove();
		wall[i].userData.wall.html.label[1].remove();
		
		if(wall[i].userData.wall.outline) { scene.remove(wall[i].userData.wall.outline); }
		if(wall[i].userData.wall.zone) { fname_s_0192(wall[i].userData.wall.zone.label); scene.remove(wall[i].userData.wall.zone.label); }			
		
		wall[i].userData.wall.p = [];
		wall[i].userData.wall.outline = null;
		wall[i].userData.wall.zone = null;
		
		scene.remove(wall[i]); 
	}
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		fname_s_0192(point[i]);
		scene.remove(point[i]); 
	}	
	
	for ( var i = 0; i < window.length; i++ )
	{ 
		fname_s_0192(window[i]); 
		scene.remove(window[i]); 
	}
	
	for ( var i = 0; i < door.length; i++ )
	{ 
		fname_s_0192(door[i]); 
		scene.remove(door[i]); 
	}	
	
	
	for ( var i = 0; i < floor.length; i++ )
	{		
		fname_s_0192(floor[i]);
		fname_s_0192(ceiling[i]);
		
		fname_s_0155({arr: infProject.html.label, o: floor[i].userData.room.html.label});
		floor[i].userData.room.html.label.remove(); 
		
		scene.remove(floor[i]); 
		scene.remove(ceiling[i]);	
	}
	
	for ( var i = 0; i < obj.length; i++ )
	{ 
		fname_s_0192(obj[i]);
		scene.remove(obj[i]);
	}

	for ( var i = 0; i < cubeCam.length; i++ )
	{
		fname_s_0192( cubeCam[i] );
		scene.remove( cubeCam[i] );		
	}
	
	
	
	for(var i = 0; i < infProject.ui.list_wf.length; i++)
	{
		infProject.ui.list_wf[i].remove();
	}		
	
	infProject.ui.list_wf = [];
	
	
	
	obj_point = [];
	room = [];
	ceiling = [];
	arrWallFront = [];
	

	countId = 2;
	
	
	var cube = infProject.tools.controllWD;
	
	
	var line = infProject.scene.size.wd_1.line;
	
	for ( var i = 0; i < line.length; i++ ) 
	{ 
		line[i].visible = false; 
		for ( var i2 = 0; i2 < line[i].userData.rulerwd.cone.length; i2++ )
		{
			line[i].userData.rulerwd.cone[i2].visible = false; 
		}
	}
		
	for ( var i = 0; i < infProject.html.wd.length; i++ ) 
	{ 
		infProject.html.wd[i].style.display = 'none'; 
		infProject.html.wd[i].userData.elem.show = false;
	}
	

	
	clickO = resetPop.clickO();
	infProject.project = null;
	infProject.scene.array = resetPop.infProjectSceneArray();
	infProject.scene.light.lamp = [];
	
	
	fname_s_0190();
}



function fname_s_0190()
{	
	
	
		
}







function fname_s_0191(cdm) 
{
	var obj = cdm.obj;	
	
	obj.traverse(function(child) 
	{
		fname_s_0192(child);
	});	
}



function fname_s_0192(node) 
{
	if (node instanceof THREE.Mesh || node instanceof THREE.Line) 
	{
		if (node.geometry) { node.geometry.dispose(); }
		
		if (node.material) 
		{
			var materialArray = [];
			
			if(node.material instanceof Array) { materialArray = node.material; }
			else { materialArray = [node.material]; }
			
			if(materialArray) 
			{
				materialArray.forEach(function (mtrl, idx) 
				{
					if (mtrl.map) mtrl.map.dispose();
					if (mtrl.lightMap) mtrl.lightMap.dispose();
					if (mtrl.bumpMap) mtrl.bumpMap.dispose();
					if (mtrl.normalMap) mtrl.normalMap.dispose();
					if (mtrl.specularMap) mtrl.specularMap.dispose();
					if (mtrl.envMap) mtrl.envMap.dispose();
					mtrl.dispose();
				});
			}
		}
	}
}





function fname_s_0193()
{
	var json = 
	{
		version: {},
		points: [],
		walls: [],	
		rooms: [],
		object: [],
		height: infProject.settings.height,		
	};
	
	var points = [];
	var walls = [];
	var rooms = [];
	var object = [];
	
	
	var wall = infProject.scene.array.wall;
	
	
	for ( var i = 0; i < wall.length; i++ )
	{			
		var p = wall[i].userData.wall.p;
		
		for ( var i2 = 0; i2 < p.length; i2++ )  
		{
			var flag = true;
			for ( var i3 = 0; i3 < points.length; i3++ ) { if(p[i2].userData.id == points[i3].id){ flag = false; break; } }
			
			if(flag) 
			{  
				var m = points.length;
				points[m] = {};
				points[m].id = p[i2].userData.id;
				points[m].pos = new THREE.Vector3(p[i2].position.x, p[i2].position.y, p[i2].position.z);
				points[m].type = 'w';
			}
		}
	}	
	
	
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var p = wall[i].userData.wall.p;
		
		walls[i] = { }; 
		
		walls[i].id = wall[i].userData.id;
		walls[i].p = { id: [p[0].userData.id, p[1].userData.id] };
		
		
		walls[i].size = {y: wall[i].userData.wall.height_1, z: wall[i].userData.wall.width};

		
		if(1==2)
		{
			var x1 = p[1].position.z - p[0].position.z;
			var z1 = p[0].position.x - p[1].position.x;	
			var dir = new THREE.Vector3(z1, 0, -x1).normalize();						
			dir.multiplyScalar( wall[i].userData.wall.offsetZ );
			walls[i].startShift = new THREE.Vector3(dir.z, 0, dir.x);			
		}
				
		var wd = fname_s_0194(wall[i]);		
		walls[i].windows = wd.windows;
		walls[i].doors = wd.doors;

		
		walls[i].material = [wall[i].userData.material[1], wall[i].userData.material[2]];						
	}	

	var floor = infProject.scene.array.floor;
	
	for ( var i = 0; i < floor.length; i++ )
	{
		rooms[i] = { contour : [] };
		
		rooms[i].id = floor[i].userData.id;  
		
		rooms[i].contour = [];
		var s = 0; for ( var i2 = floor[i].p.length - 1; i2 >= 1; i2-- ) { rooms[i].contour[s] = floor[i].p[i2].userData.id; s++; } 
		
		rooms[i].material = [floor[i].userData.material, ceiling[i].userData.material];	

		rooms[i].zone = floor[i].userData.room.zone.id;
	}
	

	
	for ( var i = 0; i < infProject.scene.array.obj.length; i++ )
	{
		var obj = infProject.scene.array.obj[i];		
			
		var m = object.length;
		object[m] = {};
		object[m].id = Number(obj.userData.id);
		object[m].lotid = Number(obj.userData.obj3D.lotid);
		object[m].pos = obj.position;
		
		object[m].q = {x: obj.quaternion.x, y: obj.quaternion.y, z: obj.quaternion.z, w: obj.quaternion.w};
		
		object[m].typeGroup = obj.userData.obj3D.typeGroup;
		
		if(obj.userData.obj3D.typeGroup == "light point")
		{
			object[m].light = { intensity: obj.children[1].intensity };
		}
	}	
	
	
	json.points = points;
	json.walls = walls;
	json.rooms = rooms;
	json.object = object;
	
	
	

	json.version.id = 2;
	json.version.rooms = { contour: [] };
	
	var contour = fname_s_046( infProject.scene.array.floor );
	
	for(var i = 0; i < contour.length; i++)
	{
		for(var i2 = 0; i2 < contour[i].length; i2++)
		{
			contour[i][i2] = {x: contour[i][i2].x, z: contour[i][i2].z};
		}
	}
	
	json.version.rooms.contour = contour;
	
	return json;
}






function fname_s_0194(wall)
{
	var windows = [], doors = [];
	
	var arrO = wall.userData.wall.arrO;

	var o = [[], []];

	for ( var i2 = 0; i2 < arrO.length; i2++ ) 
	{
		if(arrO[i2].userData.tag == 'window') { o[0][o[0].length] = arrO[i2]; }
		else if(arrO[i2].userData.tag == 'door') { o[1][o[1].length] = arrO[i2]; }		
	}

	var p = wall.userData.wall.p;

	for ( var i = 0; i < o.length; i++ )
	{
		for ( var i2 = 0; i2 < o[i].length; i2++ )
		{ 
			var wd = o[i][i2];
			var v = wd.geometry.vertices; 

			wd.updateMatrixWorld();
			wd.geometry.computeBoundingBox();
			wd.geometry.computeBoundingSphere();
			var dX = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
			var dY = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;
			var center = wd.geometry.boundingSphere.center;
		
		
			var v7 = wd.localToWorld( center.clone() );			
			var qt1 = fname_s_0238( new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize() );
			var x = fname_s_0236(new THREE.Vector3().subVectors( v7, p[0].position ), qt1).z; 
			
			x = x / p[1].position.distanceTo( p[0].position );		
			var y = wall.worldToLocal( wd.localToWorld(new THREE.Vector3(0, wd.geometry.boundingBox.min.y, 0)) ).y;
			
			
			var arr = {};
			
			arr.id = wd.userData.id;							
			arr.lotid  = wd.userData.door.lotid;				  
			arr.size = {x: dX, y: dY};									
			arr.pos = {x: x, y: y};								
			
			if(wd.userData.tag == 'window') { windows[windows.length] = arr; }
			else if(wd.userData.tag == 'door') { doors[doors.length] = arr; }			
		}		
	}

	return { windows : windows, doors : doors };
}



function fname_s_get_json()
{
	return JSON.stringify( fname_s_0193() );
}

function fname_s_0196(cdm) 
{ 
	
	var json = JSON.stringify( fname_s_0193() );
	
	if(cdm.json)
	{
		
		$.ajax
		({
			url: infProject.path+'saveJson.php',
			type: 'POST',
			data: {myarray: json, name: infProject.settings.save.file},
			dataType: 'json',
			success: function(json)
			{ 			
				 
			},
			error: function(json){   }
		});			
	}
	
	
	if(cdm.id)
	{
		
		
		$.ajax
		({
			url: infProject.path+'components/saveSql.php',
			type: 'POST',
			data: {json: json, id: cdm.id, user_id: infProject.user.id},
			dataType: 'json',
			success: function(json)
			{ 			
				
			},
			error: function(json){  }
		});			
	}
	
	if(cdm.txt)
	{	
		var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(json);	
		
		var link = document.createElement('a');
		document.body.appendChild(link);
		link.href = csvData;
		link.target = '_blank';
		link.download = 'file.json';
		link.click();			
	}	
}





function fname_s_0197(cdm) 
{
	if(cdm.id == 0) { fname_s_0189(); return; }	 
	
	
	if(cdm.json)	
	{
		$.ajax
		({
			url: infProject.path + cdm.json,
			type: 'POST',
			dataType: 'json',
			success: function(json)
			{ 
				
				fname_s_load_f(json); 	
			},
		});			
	}
	else	
	{
		$.ajax
		({
			url: infProject.path+'components/loadSql.php',
			type: 'POST',
			data: {id: cdm.id},
			dataType: 'json',
			success: function(json)
			{ 
				
				fname_s_load_f(json); 	
			},
		});		
		
	}

	
}






async function fname_s_load_f(arr) 
{     
	fname_s_0189();

	await fname_s_0199();	
	await fname_s_0271();		
	 
	if(!arr) return;
	
	
	
	infProject.project = { file: arr, load: { furn: [] } };
		
	var point = arr.points;
	var walls = arr.walls;
	var rooms = arr.rooms;
	var furn = (arr.object) ? arr.object : [];
	
	
	fname_s_05({ load: true, height: arr.height, input: true, globalHeight: true });
			
	var wall = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{
		wall[i] = { };
		
		
		wall[i].id = walls[i].id;		
		
		
		wall[i].width = walls[i].size.z;
		wall[i].height = walls[i].size.y;		
		
		wall[i].points = [];
		wall[i].points[0] = { id : walls[i].p.id[0], pos : new THREE.Vector3() };
		wall[i].points[1] = { id : walls[i].p.id[1], pos : new THREE.Vector3() };
								
		for ( var i2 = 0; i2 < point.length; i2++ ) 			 
		{  	
			if(wall[i].points[0].id == point[i2].id) { wall[i].points[0].pos = new THREE.Vector3(point[i2].pos.x, 0, point[i2].pos.z); }
			if(wall[i].points[1].id == point[i2].id) { wall[i].points[1].pos = new THREE.Vector3(point[i2].pos.x, 0, point[i2].pos.z); }
		}
		
		wall[i].material = walls[i].material;
		
		var arrO = [];
		
		if(walls[i].doors) for ( var i2 = 0; i2 < walls[i].doors.length; i2++ ) { arrO[arrO.length] = walls[i].doors[i2]; arrO[arrO.length - 1].type = 'door'; }
		if(walls[i].windows) for ( var i2 = 0; i2 < walls[i].windows.length; i2++ ) { arrO[arrO.length] = walls[i].windows[i2]; arrO[arrO.length - 1].type = 'window'; }
		
		wall[i].arrO = [];
		
		
		for ( var i2 = 0; i2 < arrO.length; i2++ )
		{					
			wall[i].arrO[i2] = {  };
			
			wall[i].arrO[i2].id = arrO[i2].id;
			wall[i].arrO[i2].pos = new THREE.Vector3(arrO[i2].pos.x, arrO[i2].pos.y, 0);
			wall[i].arrO[i2].size = new THREE.Vector2(arrO[i2].size.x, arrO[i2].size.y);
			wall[i].arrO[i2].type = arrO[i2].type;
		} 	
	}
		

	
	 
	
	var arrW = [];
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var point1 = fname_s_0242( 'point', wall[i].points[0].id );
		var point2 = fname_s_0242( 'point', wall[i].points[1].id );	
		
		if(point1 == null) { point1 = fname_s_0226( wall[i].points[0].pos, wall[i].points[0].id ); }
		if(point2 == null) { point2 = fname_s_0226( wall[i].points[1].pos, wall[i].points[1].id ); }
	

		
		
		var offsetZ = 0;
		var inf = { id: wall[i].id, p: [point1, point2], width: wall[i].width, offsetZ: -offsetZ, height: wall[i].height, load: true };
		
		
		var obj = fname_s_0227(inf); 		
		
		obj.updateMatrixWorld();
		arrW[arrW.length] = obj;
	}	
	 
	
	for ( var i = 0; i < obj_point.length; i++ ) { fname_s_0122(obj_point[i]); }
	
	fname_s_044(infProject.scene.array.wall);	

	fname_s_0166();
	
	
	for ( var n = 0; n < infProject.scene.array.floor.length; n++ )
	{
		for ( var i = 0; i < rooms.length; i++ )
		{
			if(rooms[i].reference)
			{
				var floor = fname_s_0179({pos: rooms[i].reference, obj: infProject.scene.array.floor[n]});
				
				if(floor.o == infProject.scene.array.floor[n])
				{
					infProject.scene.array.floor[n].userData.id = rooms[i].id;
					infProject.scene.array.ceiling[n].userData.id = rooms[i].id;
					
					break;
				}
			}
			else if(rooms[i].contour)
			{
				if(!fname_s_0178( infProject.scene.array.floor[n], rooms[i].contour )) continue;
				
				infProject.scene.array.floor[n].userData.id = rooms[i].id;
				infProject.scene.array.ceiling[n].userData.id = rooms[i].id;
				
				break;				
			}
		}
	}		
	
	
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var obj = arrW[i];
		
		var point1 = obj.userData.wall.p[0];
		var point2 = obj.userData.wall.p[1];		
		
		for ( var i2 = 0; i2 < wall[i].arrO.length; i2++ )
		{			
			wall[i].arrO[i2].pos.x = point1.position.distanceTo( point2.position ) * wall[i].arrO[i2].pos.x;
			
			var intP = obj.localToWorld( wall[i].arrO[i2].pos.clone() );  						

			var inf = { status : 'load', id : wall[i].arrO[i2].id, pos : intP, wall : obj, type : wall[i].arrO[i2].type };	 		
			if(wall[i].arrO[i2].size) { inf.size = wall[i].arrO[i2].size; }				
						
			fname_s_061(inf);
		}		
	}
	
	

	
	{
		var arrTexture = [];
		for ( var i = 0; i < walls.length; i++ )
		{
			arrTexture[arrTexture.length] = { objId: walls[i].id, img: walls[i].material[0].img, index: walls[i].material[0].index };
			arrTexture[arrTexture.length] = { objId: walls[i].id, img: walls[i].material[1].img, index: walls[i].material[1].index };
		}
		for ( var i = 0; i < rooms.length; i++ )
		{
			arrTexture[arrTexture.length] = { objId: rooms[i].id, img: rooms[i].material[0].img, tag: rooms[i].material[0].tag };
			arrTexture[arrTexture.length] = { objId: rooms[i].id, img: rooms[i].material[1].img, tag: rooms[i].material[1].tag };
		}
		
		
		
		
		fname_s_0200({arr: arrTexture});
	}
	
	
	fname_s_036({arr: rooms});	
	
	fname_s_0201({furn: furn});

	
	fname_s_0203();
	fname_s_097( camera.zoom );
	fname_s_099();

	renderCamera();
	
	
}





async function fname_s_0199()
{
	var url = infProject.settings.api.type.room; 
	
	
	if(window.location.hostname == 'localtest.vim.myplan.pro' || window.location.hostname == 'remstok'){ var url = 't/list_room_zone.json'; }
	

	var response = await fetch(url, { method: 'GET' });
	var json = await response.json();

	infProject.settings.room.type = json;	
	
	var json = infProject.settings.room.type;
	
	for(var i = 0; i < json.length; i++)
	{		
		var str = 
		'<div class="right_panel_1_1_list_item" type_room="'+json[i].id+'">\
			<div class="right_panel_1_1_list_item_text">'
			+json[i].title+
			'</div>\
		</div>';
		
		
		var el = $(str).appendTo('[list_ui="room_type"]');
		var id = json[i].id;
		(function(id) 
		{
			el.on('mousedown', function(){ fname_s_037({button: true, id: id}); });	
		}(id));		
	}	
}



function fname_s_0200(cdm)
{
	
	
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < cdm.arr.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(cdm.arr[i].objId == wall[i2].userData.id)
			{ 
				fname_s_0231({obj: wall[i2], material: cdm.arr[i]});
			}			
		}
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(cdm.arr[i].objId == room[i2].userData.id && cdm.arr[i].tag == 'room')
			{ 
				fname_s_0231({obj: room[i2], material: cdm.arr[i]});
			}			
		}	
		for ( var i2 = 0; i2 < ceiling.length; i2++ )
		{
			if(cdm.arr[i].objId == ceiling[i2].userData.id && cdm.arr[i].tag == 'ceiling')
			{ 
				fname_s_0231({obj: ceiling[i2], material: cdm.arr[i]});
			}			
		}			
	}
}



function fname_s_0201(cdm)
{
	var furn = cdm.furn;
	var lotid = [];
	
	for ( var i = 0; i < furn.length; i++ )
	{
		lotid[lotid.length] = Number(furn[i].lotid);

		var inf = fname_s_0273({lotid: furn[i].lotid}); 
		if(!inf) continue;	

		fname_s_0277(inf, furn[i]);
	}
	
	lotid = [...new Set(lotid)];  
	
	for ( var i = 0; i < lotid.length; i++ )
	{
		fname_s_0274({lotid: lotid[i], loadFromFile: true, furn: furn});
	}	
}



function fname_s_0202(cdm)
{ 
	var furn = cdm.furn;
	
	for ( var i = 0; i < furn.length; i++ )
	{  
		if(Number(cdm.lotid) == Number(furn[i].lotid))
		{			
			fname_s_0274(furn[i]);  

			infProject.project.load.furn[infProject.project.load.furn.length] = furn[i].id;
			
			$('[nameId="txt_loader_slider_UI"]').text((Math.round(infProject.project.load.furn.length/infProject.project.file.object.length)*100) + '%');
			
			if(infProject.project.load.furn.length == infProject.project.file.object.length)
			{ 
				fname_s_0203();
				$('[nameId="menu_loader_slider_UI"]').hide();
			}
		}
	}	
}



function fname_s_0203(cdm)
{
	
	
	for ( var i = 0; i < scene.children.length; i++ ) 
	{ 
		if(scene.children[i].userData.id) 
		{ 
			var index = parseInt(scene.children[i].userData.id);
			if(index > countId) { countId = index; }
		} 
	}	
	countId++; 
	
	
	
	
	fname_s_082(cameraTop);
	fname_s_099();	
}







var containerF = document.getElementById( 'canvasFrame' );



var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, preserveDrawingBuffer: true, } );




renderer.outputEncoding = THREE.sRGBEncoding;
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( containerF.clientWidth, containerF.clientHeight );


containerF.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdefbff );
scene.fog = new THREE.Fog('lightblue', 100, 200);

var aspect = containerF.clientWidth/containerF.clientHeight;
var d = infProject.settings.cam2D;


var cameraTop = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraTop.position.set(0, 10, 0);
cameraTop.lookAt(scene.position);
cameraTop.zoom = infProject.settings.camera.zoom;
cameraTop.updateMatrixWorld();
cameraTop.updateProjectionMatrix();
cameraTop.userData.camera = { save: { pos: cameraTop.position.clone(), zoom: cameraTop.zoom } };




var camera3D = new THREE.PerspectiveCamera( 65, containerF.clientWidth / containerF.clientHeight, 0.01, 1000 );  
camera3D.rotation.order = 'YZX';		
camera3D.position.set(5, 7, 5);
camera3D.lookAt(scene.position);
camera3D.rotation.z = 0;
camera3D.userData.camera = { type: 'fly', height: camera3D.position.y, startProject: true };
camera3D.userData.camera.click = { pos: new THREE.Vector3() };
camera3D.userData.camera.save = {}; 
camera3D.userData.camera.save.pos = camera3D.position.clone();
camera3D.userData.camera.save.radius = 0;






var cameraWall = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraWall.zoom = 2;






var cube = new THREE.Mesh( fname_s_0216(0.07, 0.07, 0.07), new THREE.MeshLambertMaterial( { color : 0x030202, transparent: true, opacity: 1, depthTest: false } ) );






function fname_s_0204() 
{
	requestAnimationFrame( fname_s_0204 );	

	fname_s_096();	
	fname_s_0101();
	
	fname_s_088();
}


function renderCamera()
{
	camera.updateMatrixWorld();	
	fname_s_0210();
	composer.render();
}




window.addEventListener( 'resize', fname_s_0206, false );
function fname_s_0206() 
{ 
	var aspect = containerF.clientWidth / containerF.clientHeight;
	var d = infProject.settings.cam2D;
	
	cameraTop.left = -d * aspect;
	cameraTop.right = d * aspect;
	cameraTop.top = d;
	cameraTop.bottom = -d;
	cameraTop.updateProjectionMatrix();

	 
	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();
	
	cameraWall.left = -d * aspect;
	cameraWall.right = d * aspect;
	cameraWall.top = d;
	cameraWall.bottom = -d;
	cameraWall.updateProjectionMatrix();
	
	renderer.setSize(containerF.clientWidth, containerF.clientHeight);
	fname_s_0210({resize: true});
	
	renderCamera();
}









var resolutionD_w = window.screen.availWidth;
var resolutionD_h = window.screen.availHeight;

var kof_rd = 1;

var countId = 2;
var camera = cameraTop;
var obj_point = [];
var room = [];
var ceiling = [];
var arrWallFront = [];

var lightMap_1 = null;

var clickO = resetPop.clickO();
infProject.project = null;
infProject.settings.active = { pg: 'pivot' };
infProject.settings.door = { width: 1, height: 2.2 };
infProject.settings.wind = { width: 1, height: 1, h1: 1.0 };
infProject.settings.room = { type: [] };
infProject.scene.light = {global: {}, lamp: []}; 
infProject.scene.array = resetPop.infProjectSceneArray();
infProject.scene.block = { key : { scroll : false } };		
infProject.scene.block.click = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.scene.block.hover = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.geometry = { circle : fname_s_0222() };
infProject.geometry.cone = [fname_s_0223({r1: 0.003, r2: 0.03, h: 0.25}), fname_s_0223({r1: 0.001, r2: 0.04, h: 0.1})];
infProject.scene.size = { wd_1: {} };	
infProject.scene.size.wd_1.line = fname_s_0221({count : 6, color : 0x616161});	
infProject.html = {};
infProject.html.label = [];	
infProject.html.wd = fname_s_0333({count: 6, display: 'none', tag: 'elem_wd_size'});
infProject.html.furn = {};
infProject.html.furn.size = fname_s_0333({count: 2, display: 'none', tag: 'elem_furn_size', style: 'border: 1px solid #646464; padding: 2px 5px; background: #fff;'});
infProject.html.furn.offset = fname_s_0333({count: 4, display: 'none', tag: 'elem_furn_offset', style: 'border: 1px solid #646464; padding: 2px 5px; background: #fff;'});
infProject.svg = {furn: {}};
infProject.svg.arr = []; 	
infProject.svg.furn.size = {};
infProject.svg.furn.size.elem = fname_s_0321({count: 2, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.size.show = infProject.settings.obj.cam2D.show.size;
infProject.svg.furn.offset = {};
infProject.svg.furn.offset.elem = fname_s_0321({count: 4, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.offset.show = infProject.settings.obj.cam2D.show.offset;
infProject.svg.furn.box2 = fname_s_0323({count: 1, color: infProject.settings.svg.scaleBox.color, dasharray: true})[0];
infProject.svg.furn.box1 = fname_s_0323({count: 1, color: infProject.settings.svg.scaleBox.color})[0];
infProject.svg.furn.boxCircle = {};
infProject.svg.furn.boxCircle.elem = fname_s_0322({count: 8, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.boxCircle.show = infProject.settings.obj.cam2D.show.scale; 
infProject.camera = { d3: { theta: 0, phi: 75 } };
infProject.camera.d3.targetO = fname_s_0209();

infProject.tools = { pivot: fname_s_0250(), gizmo: fname_s_0265(), cutWall: [], point: fname_s_0224(), axis: fname_s_0219(), controllWD: fname_s_0103() }; 
infProject.tools.floorPl = fname_s_0164();
infProject.catalog = { obj: [], texture: fname_s_0272() }; 
infProject.listColor = resetPop.listColor(); 
infProject.start = true; 


infProject.calc = {};
infProject.calc.boxScale2D = {sizeLine: null, boxCircle: null, box1: null, box2: null, offsetLine: null};
infProject.calc.boxScale2D.pos2D = new THREE.Vector2();
infProject.calc.boxScale2D.pos3D = new THREE.Vector3();
infProject.calc.boxScale2D.arrO = [];

infProject.ui = {};
infProject.ui.list_wf = [];
infProject.ui.right_menu = {active: ''};

infProject.ur = {};
infProject.ur.count = -1; 
infProject.ur.back = [];
infProject.ur.forward = [];


infProject.tools.selectionBox = { msdown : false, fname_s_0334 : new THREE.Vector2(), mStart : new THREE.Vector2(), mEnd : new THREE.Vector2(), button : false };
	

 


 



var planeMath = fname_s_0215();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
  
  


{
	var lights = [];
	lights[ 0 ] = new THREE.PointLight( 0x222222, 0.7, 0 );
	lights[ 1 ] = new THREE.PointLight( 0x222222, 0.5, 0 );
	lights[ 2 ] = new THREE.PointLight( 0x222222, 0.8, 0 );
	lights[ 3 ] = new THREE.PointLight( 0x222222, 0.2, 0 );
	
	lights[ 0 ].position.set( -1000, 200, 1000 );
	lights[ 1 ].position.set( -1000, 200, -1000 );
	lights[ 2 ].position.set( 1000, 200, -1000 );
	lights[ 3 ].position.set( 1000, 200, 1000 );
	
	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );
	scene.add( lights[ 3 ] );
	

	var light = new THREE.AmbientLight( 0xffffff, 0.93 );
	scene.add( light );
	
	infProject.scene.light.global = {ambient: light, point: lights};
}


var ccc = new THREE.Color().setHex( '0x'+infProject.settings.profile.color );



{
	var composer = new THREE.EffectComposer( renderer );
	var renderPass = new THREE.RenderPass( scene, cameraTop );
	var outlinePass = new THREE.OutlinePass( new THREE.Vector2( containerF.clientWidth, containerF.clientHeight ), scene, cameraTop );	
	
	composer.setSize( containerF.clientWidth, containerF.clientHeight );
	composer.addPass( renderPass );
	composer.addPass( outlinePass );


	if(infProject.settings.shader.saoPass)
	{
		var saoPass = new THREE.SAOPass(scene, camera, true, true);	
		
		saoPass['params']['output'] = THREE.SAOPass.OUTPUT.Default;
		saoPass['params']['saoBias'] = 1;
		saoPass['params']['saoIntensity'] = .05;
		saoPass['params']['saoScale'] = 100;
		saoPass['params']['saoKernelRadius'] = 5;
		saoPass['params']['saoMinResolution'] = 0;
		saoPass['params']['saoBlur'] = true;
		saoPass['params']['saoBlurRadius'] = 8;
		saoPass['params']['saoBlurStdDev'] = 4;
		saoPass['params']['saoBlurDepthCutoff'] = .01;
		
		composer.addPass( saoPass );		
	}
	
	if(infProject.settings.shader.fxaaPass !== undefined)
	{
		var fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );	
		fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( containerF.clientWidth * window.devicePixelRatio );
		fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( containerF.clientHeight * window.devicePixelRatio );	
		fxaaPass.enabled = false;
		
		composer.addPass( fxaaPass ); 	
	}	
	
	
	outlinePass.visibleEdgeColor.set( ccc );
	outlinePass.hiddenEdgeColor.set( ccc );
	outlinePass.edgeStrength = Number( 5 );		
	outlinePass.edgeThickness = Number( 0.01 );	

	outlinePass.selectedObjects = [];


	function fname_s_0207( cdm )
	{	
		if(!cdm) cdm = {};
		
		var arr = cdm.arr;	
		
		if(cdm.type == 'hover') { if(clickO.last_obj) { arr.push(clickO.last_obj); } }
		
		outlinePass.selectedObjects = arr;  
	}

	function fname_s_0208()
	{
		outlinePass.selectedObjects = [];
	}	
}




{
	fname_s_0214();
	fname_s_089({radious: infProject.settings.cam3D, theta: 90, phi: 35});		
	
	fname_s_023();		
	fname_s_024();
	fname_s_028({name: 'button_wrap_object'});	
	
	fname_s_032({});

	
	
	fname_s_0330({el: infProject.svg.furn.boxCircle.elem}); 
}




if(1==2)
{
	var l1 = fname_s_0321({count: 1, x1: 400, y1: 700, x2: 800, y2: 400})[0];
	l1.setAttribute("display", "block");
	var l2 = fname_s_0321({count: 1, x1: 800, y1: 400, x2: 600, y2: 200})[0];
	l2.setAttribute("display", "block");

	var dir = new THREE.Vector2(l1.x2.baseVal.value - l1.x1.baseVal.value, -(l1.y2.baseVal.value - l1.y1.baseVal.value)).normalize();

	var rotY = Math.atan2(dir.x, dir.y) - Math.PI/2;


	var pos = new THREE.Vector2(l1.x2.baseVal.value - l1.x1.baseVal.value, -(l1.y2.baseVal.value - l1.y1.baseVal.value));

	var dx = new THREE.Vector2();
	dx.x = pos.x * Math.cos(rotY) - pos.y * Math.sin(rotY);
	dx.y = pos.x * Math.sin(rotY) + pos.y * Math.cos(rotY);

	var l3 = fname_s_0321({count: 1, x1: l1.x1.baseVal.value, y1: l1.y1.baseVal.value, x2: dx.x+l1.x1.baseVal.value, y2: -dx.y+l1.y1.baseVal.value})[0];
	l3.setAttribute("display", "block");

	var x1 = l3.x2.baseVal.value - l1.x2.baseVal.value;
	var y1 = l3.y2.baseVal.value - l1.y2.baseVal.value;

	var pos = new THREE.Vector2(l2.x2.baseVal.value - l2.x1.baseVal.value, -(l2.y2.baseVal.value - l2.y1.baseVal.value));

	var dx = new THREE.Vector2();
	dx.x = pos.x * Math.cos(rotY) - pos.y * Math.sin(rotY);
	dx.y = pos.x * Math.sin(rotY) + pos.y * Math.cos(rotY);

	var l4 = fname_s_0321({count: 1, x1: l2.x1.baseVal.value + x1, y1: l2.y1.baseVal.value + y1, x2: dx.x+l2.x1.baseVal.value + x1, y2: -dx.y+l2.y1.baseVal.value + y1})[0];
	l4.setAttribute("display", "block");

	
}





function fname_s_0209()
{
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.0 );
		v[n].y = 0.01;		
		n++;		
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v[n].y = 0.01;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.0 );
		v[n].y = 0.0;
		n++;	
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v[n].y = 0.0;
		n++;		
	}	


	
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });	
	var obj = new THREE.Mesh( fname_s_0220(v), material ); 
	obj.userData.tag = '';
	obj.renderOrder = 2;
	obj.visible = false;
	
	var n = 0;
	var v2 = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v2[n].y = 0.01;		
		n++;		
		
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.26 );
		v2[n].y = 0.01;
		n++;
		
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v2[n].y = 0.0;
		n++;	
		
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.26 );
		v2[n].y = 0.0;
		n++;		
	}	
	
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	var obj_2 = new THREE.Mesh( fname_s_0220(v2), material );
	obj_2.renderOrder = 2;
	
	obj.add( obj_2 );
	scene.add( obj );
	
	fname_s_0225( obj );
	
	fname_s_0231({obj: obj, material: { img: infProject.path+"img/walk_1.png" }, repeat: {x: 1.9, y: 1.9}, offset: {x: 0.5, y: 0.5} });	
	
	return obj;
}



function fname_s_0210(cdm)
{
	if(camera != cameraTop) return;
	
	if(!cdm) cdm = {};
		
	var stop = true;
	if(cameraTop.userData.camera.save.zoom - cameraTop.zoom !== 0) { stop = false; }
	if(cameraTop.userData.camera.save.pos.x - cameraTop.position.x !== 0) { stop = false; }
	else if(cameraTop.userData.camera.save.pos.z - cameraTop.position.z !== 0) { stop = false; }
	else if(cdm.resize) { stop = false; }
	
	if(stop) return;
	
	cameraTop.userData.camera.save.pos = cameraTop.position.clone();
	cameraTop.userData.camera.save.zoom = cameraTop.zoom;
	
	
	for ( var i = 0; i < infProject.html.label.length; i++ )
	{
		var elem = infProject.html.label[i];
		
		if(elem.userData.elem.show)
		{
			if(cameraTop.zoom < 0.7) { elem.style.display = 'none'; continue; }
			else { elem.style.display = 'block'; }			
		}
		else
		{
			continue;
		}
		
		fname_s_0211({elem: elem});
	}

	for ( var i = 0; i < infProject.svg.arr.length; i++ )
	{
		var svg = infProject.svg.arr[i];
		
		
		
		if(svg.userData.svg.line)
		{
			fname_s_0324({el: svg});
		}
		else if(svg.userData.svg.circle)
		{
			fname_s_0325({el: svg});
		}
		else if(svg.userData.svg.path)
		{
			fname_s_0326({el: svg});
		}		
	}	
}


function fname_s_0211(cdm) 
{
	var elem = cdm.elem;

	
	var tempV = elem.userData.elem.pos.clone().project(camera);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	
	
	
	
	elem.style.top = `${y}px`;
	elem.style.left = `${x}px`;		
}


  
function fname_s_0212(cdm)
{
	if(!cdm) cdm = {};
	
	function fname_s_0213() 
	{ 	
		var block = $('[nameId="panel_catalog_1"]')[0];
		
		this.block = block;
		
		this.circleMin = block.querySelector('.bl_fd31'); 
		this.handle = block.querySelector('[nameId="sun_intensity_handle"]');
		this.text = block.querySelector('[nameId="sun_intensity_div"]');   
		this.value = (cdm.value !== undefined) ? cdm.value : 0.5;
		
		this.init();
	}


	fname_s_0213.prototype.init = function () 
	{	
		var self = this;
		
		$(self.handle).on("mousedown touchstart", function (event) { self.startDrag(event); });
		
		self.update();
	};


	fname_s_0213.prototype.startDrag = function (event) 
	{
		var self = this;
		
		$(self.block).on("mousemove touchmove", function (event) { self.drag(event); });
		$(self.block).on("mouseup touchend", function (event) { self.stopDrag(event); });
		
		$(window).on("mousemove touchmove", function (event) { self.drag(event); });
		$(window).on("mouseup touchend", function (event) { self.stopDrag(event); });	
	};


	fname_s_0213.prototype.stopDrag = function () 
	{
		var self = this;
		
		$(window).off("mousemove mouseup");
		$(self.block).off("mousemove mouseup");	
		
		self.update();
	};


	fname_s_0213.prototype.drag = function (event) 
	{        
		var self = this;  
		var circleMin = $(self.circleMin); 
		
		var pageX = event.pageX;
		var pageY = event.pageY;
		var touches = event.originalEvent.touches;
		
		
		if (touches && touches.length === 1) 
		{
			pageX = touches[0].pageX;
			pageY = touches[0].pageY;
		}

		var deltaX = pageX - circleMin.offset().left;

		var width = 200;	
		
		if(deltaX < 0) { deltaX = 0; }
		else if(width < deltaX) { deltaX = circleMin.width(); }
		
		  
		self.value = deltaX / width;
		
		this.update();
	};


	fname_s_0213.prototype.update = function () 
	{
		var self = this;
		var circleMin = $(self.circleMin);
		var $handle = $(self.handle);
		var $text = $(self.text);
		
		var width = 200;	
		
		var left = (self.value * width) - $handle.width() / 2;
		var top = circleMin.height() / 2 - $handle.height() / 2;
		
		
			
		$handle.css({ left: left, top: top });					
		
		var val = Math.round(self.value * 100)/100;
		$text.text(val);
		
		var obj = clickO.last_obj;
		
		if(obj)
		{
			if(obj.userData.tag == 'obj')
			{
				if(obj.userData.tag == 'obj')
				{
					if(obj.userData.obj3D.typeGroup == 'light point')
					{
						obj.children[1].intensity = val;						
						renderCamera();
					}
				}
			}
		}
		
	};

	new fname_s_0213();
}


function fname_s_0214()
{
	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 10.0, polygonOffsetUnits: 4.0 } );
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.position.y = -0.02;
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	scene.add( planeMath );	
	
	
	var cdm = {};
	var img = infProject.path+'img/f1.png';
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		if(cdm.repeat)
		{
			texture.repeat.x = cdm.repeat.x;
			texture.repeat.y = cdm.repeat.y;			
		}
		else
		{
			texture.repeat.x = 1000;
			texture.repeat.y = 1000;			
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});		
	
}



function fname_s_0215()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	
	var material = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}





function fname_s_0216(x, y, z, cdm)
{
	var geometry = new THREE.Geometry();
	x /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,0,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,0,z),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	

	if(cdm)
	{
		if(cdm.material)
		{
			geometry.faces[0].materialIndex = 1;
			geometry.faces[1].materialIndex = 1;	
			geometry.faces[2].materialIndex = 2;
			geometry.faces[3].materialIndex = 2;	
			geometry.faces[6].materialIndex = 3;
			geometry.faces[7].materialIndex = 3;				
		}
	}
	
	return geometry;
}




function fname_s_0217(cdm)  
{
	var x = cdm.x;
	var y = cdm.y;
	var z = cdm.z;
	var zC = 0;
	
	var geometry = new THREE.Geometry();
	x /= 2;
	y /= 2;
	z /= 2;
	var f = 0.9;
	
	var vertices = [
				new THREE.Vector3(-x,-y,z),
				new THREE.Vector3(-x*f,y,z*f),
				new THREE.Vector3(x*f,y,zC*f),
				new THREE.Vector3(x,-y,zC),
				new THREE.Vector3(x,-y,-zC),
				new THREE.Vector3(x*f,y,-zC*f),
				new THREE.Vector3(-x*f,y,-z*f),
				new THREE.Vector3(-x,-y,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}


function fname_s_0218(x, y, z, pr_offsetZ)
{
	var geometry = new THREE.Geometry();
	
	var h1 = 0;
	
	if(1==1)
	{
		var z1 = z / 2 + pr_offsetZ / 2;
		var z2 = -z / 2 + pr_offsetZ / 2;  		
	}
	else
	{
		var z1 = z / 2 + pr_offsetZ;
		var z2 = -z / 2 + pr_offsetZ;  		
	}
		
	var vertices = [
				new THREE.Vector3(0,h1,z1),
				new THREE.Vector3(0,y,z1),
				new THREE.Vector3(0,h1,0),
				new THREE.Vector3(0,y,0),
				new THREE.Vector3(0,h1,z2),
				new THREE.Vector3(0,y,z2),								
								
				new THREE.Vector3(x,h1,z1),
				new THREE.Vector3(x,y,z1),
				new THREE.Vector3(x,h1,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,h1,z2),
				new THREE.Vector3(x,y,z2),						
			];	
			
	var faces = [
				new THREE.Face3(0,6,7),
				new THREE.Face3(7,1,0),
				new THREE.Face3(4,5,11),
				new THREE.Face3(11,10,4),				
				new THREE.Face3(1,7,9),
				new THREE.Face3(9,3,1),					
				new THREE.Face3(9,11,5),
				new THREE.Face3(5,3,9),				
				new THREE.Face3(6,8,9),
				new THREE.Face3(9,7,6),				
				new THREE.Face3(8,10,11),
				new THREE.Face3(11,9,8),
				
				new THREE.Face3(0,1,3),
				new THREE.Face3(3,2,0),	

				new THREE.Face3(2,3,5),
				new THREE.Face3(5,4,2),	

				new THREE.Face3(0,2,8),
				new THREE.Face3(8,6,0),

				new THREE.Face3(2,4,10),
				new THREE.Face3(10,8,2),					
			];
	
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];					


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	
	
	geometry.faces[0].materialIndex = 1;
	geometry.faces[1].materialIndex = 1;	
	geometry.faces[2].materialIndex = 2;
	geometry.faces[3].materialIndex = 2;	
	geometry.faces[4].materialIndex = 3;
	geometry.faces[5].materialIndex = 3;
	geometry.faces[6].materialIndex = 3;
	geometry.faces[7].materialIndex = 3;
	
	return geometry;
}



function fname_s_0219() 
{
	var axis = [];
	
	var geometry = fname_s_0216(0.5, 0.02, 0.02);		
	var v = geometry.vertices;	
	v[3].x = v[2].x = v[5].x = v[4].x = 500;
	v[0].x = v[1].x = v[6].x = v[7].x = -500;	
	
	var material = new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, depthTest: false, lightMap : lightMap_1 } );
	
	for(var i = 0; i < 2; i++)
	{
		axis[i] = new THREE.Mesh( geometry, material );
		axis[i].renderOrder = 2;
		axis[i].visible = false;
		scene.add( axis[i] );				
	}		
	
	return axis;
}


function fname_s_0220( vertices )
{
	var geometry = new THREE.Geometry();

	var faces = [];

	var n = 0;
	for ( var i = 0; i < vertices.length - 4; i += 4 )
	{
		faces[ n ] = new THREE.Face3( i + 0, i + 4, i + 6 ); n++;
		faces[ n ] = new THREE.Face3( i + 6, i + 2, i + 0 ); n++;

		faces[ n ] = new THREE.Face3( i + 2, i + 6, i + 7 ); n++;
		faces[ n ] = new THREE.Face3( i + 7, i + 3, i + 2 ); n++;

		faces[ n ] = new THREE.Face3( i + 3, i + 7, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 1, i + 3 ); n++;

		faces[ n ] = new THREE.Face3( i + 0, i + 1, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 4, i + 0 ); n++;
	}


	faces[ n ] = new THREE.Face3( i + 0, 0, 2 ); n++;
	faces[ n ] = new THREE.Face3( 2, i + 2, i + 0 ); n++;

	faces[ n ] = new THREE.Face3( i + 2, 2, 3 ); n++;
	faces[ n ] = new THREE.Face3( 3, i + 3, i + 2 ); n++;

	faces[ n ] = new THREE.Face3( i + 3, 3, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, i + 1, i + 3 ); n++;

	faces[ n ] = new THREE.Face3( i + 0, i + 1, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, 0, i + 0 ); n++;



	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.computeFaceNormals();
	geometry.uvsNeedUpdate = true;

	return geometry;
}




function fname_s_0221(cdm)
{
	var arr = [];
	
	if(cdm.material == 'standart') { var mat = { color: cdm.color }; }
	else { var mat = { color: cdm.color, transparent: true, depthTest : false }; }
	
	var material = new THREE.LineBasicMaterial( mat );
	
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		arr[i] = new THREE.Mesh( fname_s_0216(1, 0.025, 0.025), material );
		var v = arr[i].geometry.vertices; 
		v[0].x = v[1].x = v[6].x = v[7].x = -0.5;
		v[3].x = v[2].x = v[5].x = v[4].x = 0.5;
		
		v[0].y = v[3].y = v[4].y = v[7].y = -0.025/2;
		v[1].y = v[2].y = v[5].y = v[6].y = 0.025/2;
		
		arr[i].geometry.verticesNeedUpdate = true;			
		arr[i].visible = false;	 
		arr[i].renderOrder = 1;
		arr[i].userData = {rulerwd: {cone:[]}};
		scene.add( arr[i] );
		
		for ( var i2 = 0; i2 < cdm.count; i2++ )
		{
			var cone = new THREE.Mesh(infProject.geometry.cone[1], material); 
			cone.visible = false;
			scene.add( cone );	
			
			arr[i].userData.rulerwd.cone[i2] = cone;			
		}
	}
	
	return arr;
}





function fname_s_0222()
{
	var count = 48;
	var circle = [];
	var g = (Math.PI * 2) / count;
	
	for ( var i = 0; i < count; i++ )
	{
		var angle = g * i;
		circle[i] = new THREE.Vector3();
		circle[i].x = Math.sin(angle);
		circle[i].z = Math.cos(angle);
		
	}

	return circle;
}



function fname_s_0223(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	var r2 = cdm.r2;
	var h = cdm.h;
	var r1 = cdm.r1;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r2 );
		v[n].y = -h;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = -h;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r1 );
		v[n].y = 0.001;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.001;
		n++;		
	}	 
	
	return fname_s_0220(v);
}


function fname_s_0224()
{	
	var n = 0;
	var v = [];
	
	var geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
	
	var obj = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, opacity: 0.5, depthTest: false } ) );
	obj.userData.tag = 'tool_point';
	obj.userData.tool_point = {};
	obj.renderOrder = 1;
	obj.position.set(0,0,0);
	obj.visible = false;	
	scene.add( obj );
	
	
	if(1==1)
	{
		var v2 = [];
		var v = obj.geometry.vertices;
		for ( var i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		obj.userData.tool_point.v2 = v2;		
	}	
	
	
	return obj;
}




function fname_s_0225( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {			
			return Math.abs(faces[i].normal[a]) - Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true; 
}




function fname_s_0226( pos, id )
{
	var point = obj_point[obj_point.length] = new THREE.Mesh( infProject.tools.point.geometry, infProject.tools.point.material.clone() );
	point.position.copy( pos );		

	point.renderOrder = 1;
	
	point.w = [];
	point.p = [];
	point.start = [];		
	point.zone = [];
	point.zoneP = [];
	
	
	if(id == 0) { id = countId; countId++; }	
	point.userData.id = id;	
	point.userData.tag = 'point';
	point.userData.point = {};
	point.userData.point.color = point.material.color.clone();
	point.userData.point.cross = null;
	point.userData.point.type = null;
	point.userData.point.last = { pos : pos.clone(), cdm : '', cross : null };
	
	point.visible = (camera == cameraTop) ? true : false;	
	
	scene.add( point );	
	
	return point;
}


  



function fname_s_0227( cdm ) 
{
	var point1 = cdm.p[0];
	var point2 = cdm.p[1];
	var width = (cdm.width) ? cdm.width : infProject.settings.wall.width;
	var offsetZ = (cdm.offsetZ) ? cdm.offsetZ : 0;  
	var height = (cdm.height) ? cdm.height : infProject.settings.height; 
	
	var p1 = point1.position;
	var p2 = point2.position;	
	var d = p1.distanceTo( p2 );
	
	
	{
		var color = [0x7d7d7d, 0x696969]; 	
		
		if(infProject.settings.wall.color) 
		{  
			if(infProject.settings.wall.color.front) color[0] = infProject.settings.wall.color.front; 
			if(infProject.settings.wall.color.top) color[1] = infProject.settings.wall.color.top; 
		}	
		
		var material = new THREE.MeshPhongMaterial({ color : color[0], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
		var materialTop = new THREE.MeshPhongMaterial({ color: color[1], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
		
		var materials = [ material.clone(), material.clone(), material.clone(), materialTop ];	
	}
	
	
	var geometry = fname_s_0218(d, height, width, offsetZ);	
	var wall = new THREE.Mesh( geometry, materials ); 
 	infProject.scene.array.wall[infProject.scene.array.wall.length] = wall;		
	
	wall.position.copy( p1 );
	
	
	if(!cdm.id) { cdm.id = countId; countId++; }
	
	wall.userData.tag = 'wall';
	wall.userData.id = cdm.id;
	
	wall.userData.wall = {};				
	wall.userData.wall.p = [];
	wall.userData.wall.p[0] = point1;
	wall.userData.wall.p[1] = point2;	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.height_0 = 0;
	wall.userData.wall.height_1 = Math.round(height * 100) / 100;		
	wall.userData.wall.offsetZ = Math.round(offsetZ * 100) / 100;
	wall.userData.wall.outline = null;
	wall.userData.wall.zone = null; 
	wall.userData.wall.arrO = [];
	wall.userData.wall.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3() }; 
	wall.userData.wall.area = { top : 0 }; 
	
	wall.userData.wall.room = { side : 0, side2 : [null,null,null] };
	wall.userData.wall.html = {};
	wall.userData.wall.html.label = fname_s_0333({count: 2, tag: 'elem_wall_size'});
	
	wall.userData.wall.svg = {};
	wall.userData.wall.svg.lineW = null;
	
	
	wall.userData.wall.show = true;
	
	var v = wall.geometry.vertices;
	wall.userData.wall.v = [];
	
	for ( var i = 0; i < v.length; i++ ) { wall.userData.wall.v[i] = v[i].clone(); }
	
	wall.userData.material = [];
	wall.userData.material[0] = { index: 0, color: wall.material[0].color, img: null };	
	wall.userData.material[1] = { index: 1, color: wall.material[1].color, img: null };	
	wall.userData.material[2] = { index: 2, color: wall.material[2].color, img: null };	
	wall.userData.material[3] = { index: 3, color: wall.material[3].color, img: null };
	

	wall.castShadow = true;	
	wall.receiveShadow = true;
	
	fname_s_0235( wall );
	
	cdm.material = [];
	cdm.material[0] = { img: infProject.path+"img/load/beton.jpg", index:1 };
	cdm.material[1] = { img: infProject.path+"img/load/beton.jpg", index:2 };
	
	if(cdm.material)
	{  
		for ( var i = 0; i < cdm.material.length; i++ )
		{			
			fname_s_0231({obj: wall, material: cdm.material[i]});
		}	
	}
	
	
	
	var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);
	
	
	var n = point1.w.length;		
	point1.w[n] = wall;
	point1.p[n] = point2;
	point1.start[n] = 0;	
	
	var n = point2.w.length;		
	point2.w[n] = wall;
	point2.p[n] = point1;
	point2.start[n] = 1;		
	
	scene.add( wall );
		
	return wall;
}


function fname_s_0228( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	var y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
	
	return new THREE.Vector2(x, y);
}


function fname_s_0229( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) );
	var y = ( ( event.clientY - containerF.offsetTop ) );	
	
	return new THREE.Vector2(x, y);
}	
	

function fname_s_0230( event, obj, t ) 
{
	mouse = fname_s_0228( event );
	
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj,true ); }
	
	return intersects;
}





function fname_s_0231(cdm)
{
	
	
	var img = cdm.material.img;
	
	if(!img) return;
	
	var material = (cdm.obj.userData.tag == "wall") ? cdm.obj.material[cdm.material.index] : cdm.obj.material;
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		if(cdm.repeat)
		{
			texture.repeat.x = cdm.repeat.x;
			texture.repeat.y = cdm.repeat.y;			
		}
		else
		{
			texture.repeat.x = 1.0;
			texture.repeat.y = 1.0;	
		}
		
		if(cdm.offset)
		{
			texture.offset.x = cdm.offset.x;
			texture.offset.y = cdm.offset.y;				
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = null;
		material.needsUpdate = true; 


		if(cdm.obj.userData.tag == "wall")
		{
			cdm.obj.userData.material[cdm.material.index].img = img;
			
			if(cdm.ui)
			{
				fname_s_034({obj: cdm.obj});
			}
		}
		
		if(cdm.obj.userData.tag == "room" || cdm.obj.userData.tag == "ceiling")
		{
			cdm.obj.userData.material.img = img;
			
			if(cdm.ui)
			{
				fname_s_035({obj: cdm.obj});
			}
		}		
		
		renderCamera();
	});			
}






function fname_s_0232( event )
{
	if(!clickO.button) return;	
	
	if(camera == cameraTop)
	{
		planeMath.position.set(0, 0, 0);
		planeMath.rotation.set(-Math.PI/2, 0, 0);
	}
	if(camera == cameraWall)
	{
		var dir = camera.getWorldDirection();
		dir.addScalar(-10);
		planeMath.position.copy(camera.position);
		planeMath.position.add(dir);  
		planeMath.rotation.copy( camera.rotation ); 				
	}
	
	planeMath.updateMatrixWorld();

	var intersects = fname_s_0230( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;	
	
	if(camera == cameraTop)
	{ 
		if(clickO.button == 'create_wall')
		{
			clickO.obj = null; 
			clickO.last_obj = null;
			
			var point = fname_s_0226( intersects[0].point, 0 );
			point.position.y = 0;
			point.userData.point.type = clickO.button; 
			clickO.move = point;				
		}
		else if(clickO.button == 'create_wd_2')
		{
			fname_s_061({type:'door', lotid: 4});
		}
		else if(clickO.button == 'create_wd_3')
		{
			fname_s_061({type:'window', lotid: 1});
		}			
		else if(clickO.button == 'add_lotid')
		{
			fname_s_0274({lotid: clickO.options, cursor: true});
		}		
	}
	else if(camera == camera3D)
	{
		if(clickO.button == 'add_lotid')
		{
			fname_s_0274({lotid: clickO.options, cursor: true});
		}		
	}
	else if(camera == cameraWall)
	{
		if(clickO.button == 'create_wd_3')
		{
			fname_s_061({type:'window'});
		}
	}
	
	clickO.buttonAct = clickO.button;
	clickO.button = null;

	
}	
	

function fname_s_active_int(cdm)
{
	if(clickO.move)
	{
		fname_s_0234();
		fname_s_073();
	}

	
	if(cdm)
	{		
		fname_s_0234();	
		
		if(cdm.button == '2D')
		{  			
			fname_s_082(cameraTop);
		}
		else if(cdm.button == '3D')
		{
			fname_s_082(camera3D);
		}	
		else if(cdm.button == 'point_1')
		{
			clickO.button = 'create_wall';
		}
		else if(cdm.button == 'create_wd_2')
		{
			clickO.button = 'create_wd_2';
		}
		else if(cdm.button == 'create_wd_3')
		{
			clickO.button = 'create_wd_3';
		}		
		else if(cdm.button == 'add_lotid')
		{
			clickO.button = 'add_lotid';
			clickO.options = cdm.value;
		}					
	}

}	




function fname_s_0234()
{
	clickO.obj = null;
	clickO.rayhit = null;
	
	fname_s_079();		
}




function fname_s_0235( obj )
{ 
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	var n = 1;
	
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {
			return Math.abs(faces[i].normal[a]) > Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true;	
}






function fname_s_0236(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


function fname_s_0237(dir1, dir_local)
{	
	var qt = fname_s_0238(dir1);			
	return dir_local.applyQuaternion( qt );
}


function fname_s_0238(dir1)
{
	var mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}

 

 
 


function fname_s_0239() 
{ 
	try 
	{		
		renderer.antialias = true;
		renderer.render( scene, camera );
		
		var strMime = "image/png";
		var imgData = renderer.domElement.toDataURL(strMime);	

		renderer.antialias = false;
		renderer.render( scene, camera );
 
		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");
	} 
	catch (e) 
	{
		
		return;
	}
}



function fname_s_0240() 
{ 
	try 
	{		
		var rd = 400/containerF.clientWidth;
		
		renderer.setSize( 400, containerF.clientHeight *rd );
		renderer.antialias = true;
		renderer.render( scene, camera );
		
		var imgData = renderer.domElement.toDataURL("image/jpeg", 0.7);	

		renderer.setSize( containerF.clientWidth, containerF.clientHeight );
		renderer.antialias = false;
		renderer.render( scene, camera );
		
		return imgData;
	} 
	catch (e) 
	{
		
		return null;
	}
}



var openFileImage = function (strData, filename) 
{
	var link = containerF.createElement('a');
	
	if(typeof link.download === 'string') 
	{		
		containerF.appendChild(link); 
		link.download = filename;
		link.href = strData;
		link.click();
		containerF.removeChild(link); 
	} 
	else 
	{
		location.replace(uri);
	}
}; 
  
 
	
	
 
function fname_s_0241()
{
	 
}




function fname_s_0242( cdm, id )
{
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	var obj = infProject.scene.array.obj; 
	
	
	if(cdm == 'wall')
	{
		for ( var i = 0; i < wall.length; i++ ){ if(wall[i].userData.id == id){ return wall[i]; } }			
	}
	else if(cdm == 'point')
	{
		for ( var i = 0; i < point.length; i++ ){ if(point[i].userData.id == id){ return point[i]; } }
	}
	else if(cdm == 'wd')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'window')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
	}
	else if(cdm == 'door')
	{
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'room')
	{
		for ( var i = 0; i < floor.length; i++ ){ if(floor[i].userData.id == id){ return floor[i]; } }
	}
	else if(cdm == 'obj')
	{
		for ( var i = 0; i < obj.length; i++ ){ if(obj[i].userData.id == id){ return obj[i]; } }
	}
	
	return null;
}



fname_s_0204();
renderCamera();



containerF.addEventListener('contextmenu', function(event) { event.preventDefault() });
containerF.addEventListener( 'mousedown', fname_s_074, false );
containerF.addEventListener( 'mousemove', fname_s_077, false );
containerF.addEventListener( 'mouseup', fname_s_078, false );


containerF.addEventListener( 'touchstart', fname_s_074, false );
containerF.addEventListener( 'touchmove', fname_s_077, false );
containerF.addEventListener( 'touchend', fname_s_078, false );

containerF.addEventListener('DOMMouseScroll', fname_s_095, false);
containerF.addEventListener('mousewheel', fname_s_095, false);	


document.addEventListener("keydown", function (e) 
{ 
	if(clickO.keys[e.keyCode]) return;
	
	if(infProject.activeInput) 
	{ 
		if(e.keyCode == 13)
		{ 
			
			
			if(infProject.activeInput == 'input-height') { changeHeightWall(); } 
			if(infProject.activeInput == 'wall_1') { fname_s_01({}); }	 		
			if(infProject.activeInput == 'size-wd-length') { fname_s_0146(clickO.last_obj); }
			if(infProject.activeInput == 'size-wd-height') { fname_s_0146(clickO.last_obj); }
			if(infProject.activeInput == 'rp_wd_h1') { fname_s_0146(clickO.last_obj); }
			if(infProject.activeInput == 'size_wall_width_1') 
			{ 
				var width = $('[nameid="size_wall_width_1"]').val();
				
				fname_s_04({wall:clickO.last_obj, width:{value: width}, offset:'wallRedBlueArrow'}); 
			}			
		}		
		 
		return; 
	}


	if(e.keyCode == 46 || e.keyCode == 8) { fname_s_0148(); }
	
	if(e.keyCode == 90 && e.ctrlKey || e.keyCode == 90 && e.keyCode == 91) { fname_s_0348( 'undo' ); }	
	if(e.keyCode == 89 && e.ctrlKey || e.keyCode == 89 && e.keyCode == 91) { fname_s_0348( 'redo' ); }	
	
	if(clickO.keys[18] && e.keyCode == 90) { fname_s_0197({json: true}); }		
	if(clickO.keys[18] && e.keyCode == 72) { fname_s_0191(scene, fname_s_0192); fname_s_0190(); }		
	if(clickO.keys[18] && e.keyCode == 77) { fname_s_0197({id: 0}); }				
	if(clickO.keys[18] && e.keyCode == 84) { fname_s_0196({json: true}); }			
	if(clickO.keys[18] && e.keyCode == 86) {  }
	if(clickO.keys[18] && e.keyCode == 86) {  }  		
	if(clickO.keys[18] && e.keyCode == 66) 	
	{ 
		if(infProject.settings.shader.saoPass)
		{
			saoPass['params']['output'] = (saoPass['params']['output']==THREE.SAOPass.OUTPUT.Default)? THREE.SAOPass.OUTPUT.Beauty : THREE.SAOPass.OUTPUT.Default;
			
			renderCamera();			
		}
	}  
	
	if(e.keyCode == 66) { fname_s_camera3d_view(); } 	
	
	if(e.keyCode == 89 && !e.ctrlKey) { fname_s_0196({txt: true}); } 			
	
} );

document.addEventListener("keydown", function (e) 
{ 
	clickO.keys[e.keyCode] = true;
	if(e.keyCode == 61) { zoomLoop = 'zoomIn'; }
	if(e.keyCode == 173) { zoomLoop = 'zoomOut'; }
	if(e.keyCode == 187) { zoomLoop = 'zoomIn'; }
	if(e.keyCode == 189) { zoomLoop = 'zoomOut'; }	
});
document.addEventListener("keyup", function (e) 
{ 
	clickO.keys[e.keyCode] = false;
	if(e.keyCode == 173) { zoomLoop = ''; }
	if(e.keyCode == 61) { zoomLoop = ''; }
	if(e.keyCode == 187) { zoomLoop = ''; }
	if(e.keyCode == 189) { zoomLoop = ''; }


	if(camera == cameraTop)
	{
		if(e.keyCode == 16){ fname_s_0338(); } 
	}
	
});







function fname_s_0243(cdm)
{
	if(!cdm) return;	
	if(infProject.settings.shader.fxaaPass == undefined) return;
	
	if(cdm.switch)
	{
		var visible = (fxaaPass.enabled) ? false : true;
	}

	if(cdm.visible !== undefined)
	{
		var visible = cdm.visible;
	}		
	
	fxaaPass.enabled = visible;		


	renderCamera();
}



function fname_s_0244(cdm)
{  
	if(!cdm) return;
	
	if(cdm.switch)
	{
		var type = infProject.settings.light.type;
		type = (type == 'global') ? 'lamp' : 'global';
		infProject.settings.light.type = type;
	}
	
	if(cdm.visible !== undefined)
	{
		var type = (cdm.visible) ? 'global' : 'lamp';
		infProject.settings.light.type = type;
	}	
	
	if(infProject.settings.light.type == 'global')
	{
		var global_intensity = 0.93;
		var global_visible = true;
		var lamp_visible = false;
	}
	else
	{
		var global_intensity = 0.5;
		var global_visible = false;
		var lamp_visible = true;			
	}
	
	for ( var i = 0; i < infProject.scene.light.lamp.length; i++ )
	{
		infProject.scene.light.lamp[i].visible = lamp_visible;
	}
	
	for ( var i = 0; i < infProject.scene.light.global.point.length; i++ )
	{
		infProject.scene.light.global.point[i].visible = global_visible;
	}		
	
	infProject.scene.light.global.ambient.intensity = global_intensity;
	
	renderCamera();
}






function fname_s_0245(cdm)
{	
	var value = cdm.value; 
	
	
	if((/,/i).test( value )) { value = value.replace(",", "."); }
	
	if(!fname_s_06(value)) return null; 
	
	value = Number(value);
	
	if(cdm.abs)
	{
		value = Math.abs(value);
	}
	
	if(cdm.int)
	{ 
		value = Math.round(value);  
	}	
	
	if(cdm.unit)
	{
		if(cdm.unit == 0.01) { value /= 100; } 
		else if(cdm.unit == 0.001) { value /= 1000; } 
	}		

	if(cdm.limit)
	{
		if(cdm.limit.max < value) { value = cdm.limit.max; }
		if(cdm.limit.min > value) { value = cdm.limit.min; }
	}

	return {num: value};	
}







var docReady = false;

$(document).ready(function () 
{ 
	docReady = true; 	
		 
	 
	 
	if(infProject.settings.load.file)
	{
		fname_s_0197({json: infProject.settings.load.file});
	}		
	  
	
	
	
	
});






















$(document).ready(function(){

$('[data-action="top_panel_1"]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
$('[ui_1=""]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
		
$('[data-action="top_panel_1"]').mousedown(function () { fname_s_active_int(); });
$('[data-action="left_panel_1"]').mousedown(function () { fname_s_active_int(); });



$('[nameId="camera_button"]').change(function() { fname_s_active_int({button: $( this ).val()}); });




$('[nameId="button_wrap_catalog"]').mousedown(function () { fname_s_028({el: this}); });
$('[nameId="button_wrap_list_obj"]').mousedown(function () { fname_s_028({el: this}); });
$('[nameId="button_wrap_object"]').mousedown(function () { fname_s_028({el: this}); });
$('[nameId="button_wrap_plan"]').mousedown(function () { fname_s_028({el: this}); });

	

$('[nameId="obj_rotate_reset"]').mousedown(function () { fname_s_0264(); });	
$('[nameId="button_copy_obj"]').mousedown(function () { fname_s_0263(); });
$('[nameId="button_delete_obj"]').mousedown(function () { fname_s_0260({obj: clickO.last_obj}); });


$('[data-action="wall"]').mousedown(function () { fname_s_active_int({button:'point_1'}); });
$('[data-action="create_wd_2"]').mousedown(function () { fname_s_active_int({button:'create_wd_2'}); });
$('[data-action="create_wd_3"]').mousedown(function () { fname_s_active_int({button:'create_wd_3'}); });
$('[add_lotid]').mousedown(function () { fname_s_active_int({button: 'add_lotid', value: this.attributes.add_lotid.value}); });
$('[data-action="screenshot"]').mousedown(function () { fname_s_0239(); return false; }); 				


$('[nameId="zoom_camera_butt_m"]').mousedown(function () { zoomLoop = 'zoomOut'; });
$('[nameId="zoom_camera_butt_p"]').mousedown(function () { zoomLoop = 'zoomIn'; });
$(window).mouseup(function () { zoomLoop = ''; });


$('[data-action="deleteObj"]').mousedown(function () { fname_s_0148(); return false; });
$('[data-action="fname_s_053"]').mousedown(function () { fname_s_053(); return false; });



$('input').on('focus', function () { fname_s_0246({el: $(this), act: 'down'}); });
$('input').on('change', function () { fname_s_0246({el: $(this), act: 'up'}); });
$('input').on('keyup', function () {  });

function fname_s_0246(cdm)
{
	var el = cdm.el;
	
	infProject.activeInput = el.data('action');
	if(el.data('action') == undefined) { infProject.activeInput = el.data('input'); }
	if(infProject.activeInput == undefined) { infProject.activeInput = el.attr('nameId'); }
	
	infProject.activeInput_2 = {el: el, act: cdm.act};
	
	if(cdm.act == 'down' || cdm.act == 'up')
	{
		
	}
	
	if(cdm.act == 'up')
	{
		fname_s_0247();
	}
		
}


function fname_s_0247(cdm)
{
	if(infProject.activeInput == 'rp_floor_height')
	{
		fname_s_05({ height: $('[nameId="rp_floor_height"]').val(), input: true, globalHeight: true });
	}
	else if(infProject.activeInput == 'rp_wall_width_1')
	{
		fname_s_033({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_length_1')
	{
		fname_s_033({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_height_1')
	{
		fname_s_033({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_length_1')
	{
		fname_s_033({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_height_1')
	{
		fname_s_033({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_above_floor_1')
	{
		fname_s_033({ el: infProject.activeInput_2.el });
	}	
}


$('input').blur(function () 
{ 
	infProject.activeInput = '';
	infProject.activeInput_2 = null;
});	



$('[nameId="rp_button_apply"]').mousedown(function () 
{  
	var obj = clickO.last_obj;
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	if(obj.userData.tag == 'wall')
	{
		var width = $('[nameid="size_wall_width_1"]').val();
		
		fname_s_04({wall:clickO.last_obj, width:{value: width}, offset:'wallRedBlueArrow'});		
	}
	else if(obj.userData.tag == 'window')
	{
		fname_s_0146(clickO.last_obj);
	}
	else if(obj.userData.tag == 'door')
	{
		fname_s_0146(clickO.last_obj);
	}	
});



$('[nameId="rp_button_wall_texture_1"]').mousedown(function () 
{ 
	clickO.click.side_wall = 1; 
	clickO.click.o = clickO.last_obj;
	fname_s_025({type: 2});
});

$('[nameId="rp_button_wall_texture_2"]').mousedown(function () 
{ 
	clickO.click.side_wall = 2; 
	clickO.click.o = clickO.last_obj;
	fname_s_025({type: 2});
});

$('[nameId="rp_button_room_texture_1"]').mousedown(function () 
{ 
	clickO.click.o = clickO.last_obj; 
	fname_s_026({type: 2}); 
});

$('[nameId="rp_button_room_texture_2"]').mousedown(function () 
{ 
	clickO.click.o = fname_s_0163({obj: clickO.last_obj}).ceiling;
	fname_s_026({type: 2}); 	
});


$('[nameId="but_back_catalog_texture_1"]').mousedown(function () 
{ 
	fname_s_025({type: 1});
});

$('[nameId="but_back_catalog_texture_2"]').mousedown(function () 
{ 
	fname_s_026({type: 1});
});

$('[add_texture]').mousedown(function () 
{ 
	var inf = {obj: clickO.click.o, material: {img: this.attributes.add_texture.value, index: clickO.click.side_wall}, ui: true};
	if(camera == camera3D)
	{ 
		if(clickO.index) 
		{ 
			inf.obj = clickO.last_obj;
			inf.material.index = clickO.index; 
		};
	}
	
	fname_s_0231(inf); 
}); 




$('[data-action="modal_window"]').mousedown(function (e) { e.stopPropagation(); });		


$('[data-action="modal"]').mousedown(function () 
{			
	fname_s_active_int(); 
	$('[data-action="modal"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close"]').mousedown(function () 
{  
	$('[data-action="modal"]').css({"display":"none"}); 
});



$('[data-action="modal_1"]').mousedown(function () 
{	 
	$('[data-action="modal_1"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close_1"]').mousedown(function () 
{  
	$('[data-action="modal_1"]').css({"display":"none"}); 
});


$('[nameId="butt_main_sett"]').mousedown(function () { $('[nameId="window_main_sett"]').css({"display":"block"}); });

$('[nameId="button_close_main_sett"]').mousedown(function () 
{  
	$('[nameId="window_main_sett"]').css({"display":"none"}); 
});

$('[nameId="checkbox_light_global"]').change(function() { fname_s_0244({visible: this.checked}); });
$('[nameId="checkbox_fxaaPass"]').change(function() { fname_s_0243({visible: this.checked}); });



$('[nameId="background_main_menu"]').mousedown(function () 
{	 
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

			
$('[nameId="button_close_main_menu"]').mousedown(function () 
{  
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

$('[nameId="window_main_menu"]').mousedown(function (e) { e.stopPropagation(); });
	
	

$('[nameId="button_check_reg_1"]').mousedown(function () { changeMainMenuRegistMenuUI({el: this}); });
$('[nameId="button_check_reg_2"]').mousedown(function () { changeMainMenuRegistMenuUI({el: this}); });	









$('[nameId="button_show_panel_catalog"]').mousedown(function () { fname_s_0248({show: true}); });
$('[nameId="button_catalog_close"]').mousedown(function () { fname_s_0248({show: false}); });


function fname_s_0248(cdm)
{
	var show = cdm.show;
	
	var block = $('[nameId="panel_catalog_1"]');
	var button = $('[nameId="button_show_panel_catalog"]');
	
	if(show) { block.show(); button.hide(); }
	else { block.hide(); button.show(); }
}









$('#load_obj_1').change(fname_s_0249);

function fname_s_0249(e) 
{
	if (this.files[0]) 
	{		
		var reader = new FileReader();
		reader.onload = function (e) 
		{						
			fname_s_0284({data: e.target.result});
		};				

		reader.readAsArrayBuffer(this.files[0]);  									
	};
};


$('[nameId="butt_main_load_obj"]').mousedown(function () { $('[nameId="window_main_load_obj"]').css({"display":"block"}); });

$('[nameId="button_close_main_load_obj"]').mousedown(function () { $('[nameId="window_main_load_obj"]').css({"display":"none"}); });

$('[nameId="butt_load_obj_2"]').mousedown(function () { fname_s_0285(); });


});









function fname_s_0250()
{
	var pivot = new THREE.Object3D();
	pivot.userData.pivot = {};
	pivot.userData.pivot.active = { axis: '', startPos: new THREE.Vector3(), dir: new THREE.Vector3(), qt: new THREE.Quaternion() };
	pivot.userData.pivot.obj = null;
	pivot.userData.pivot.axs = [];
	
	var param = [];
	param[0] = {axis: 'x', pos: new THREE.Vector3(0.6, 0.0, 0.0), rot: new THREE.Vector3(0, 0, 0)};
	param[1] = {axis: 'x', pos: new THREE.Vector3(-0.6, 0.0, 0.0), rot: new THREE.Vector3(0, Math.PI, 0)};
	param[2] = {axis: 'z', pos: new THREE.Vector3(0.0, 0.0, -0.6), rot: new THREE.Vector3(0, Math.PI/2, 0)};
	param[3] = {axis: 'z', pos: new THREE.Vector3(0.0, 0.0, 0.6), rot: new THREE.Vector3(0, -Math.PI/2, 0)};
	
	var geometry = fname_s_0217({x: 0.35, y: 0.01, z: 0.35});
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	
	for ( var i = 0; i < param.length; i++ )
	{
		var obj = new THREE.Mesh( geometry, material );
		obj.userData.tag = 'pivot';
		obj.userData.axis = param[i].axis;	
		obj.renderOrder = 2;
		
		if(param[i].pos) obj.position.set( param[i].pos.x, param[i].pos.y, param[i].pos.z );
		if(param[i].rot) obj.rotation.set( param[i].rot.x, param[i].rot.y, param[i].rot.z );
		
		param[i].o = obj;
		
		pivot.add( obj );
	}
	
	var y = fname_s_0251({axis: 'y', pos: new THREE.Vector3(0,0.1,0), rot: new THREE.Vector3(0,0,0), color: 0xcccccc});
	pivot.add( y );
	
	pivot.visible = false;
	scene.add( pivot );
	
	
	pivot.userData.pivot.axs.x = param[0].o;
	pivot.userData.pivot.axs.y = y;
	pivot.userData.pivot.axs.z = param[2].o;	
		
	
	
	return pivot;
}





function fname_s_0251(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.06 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = 0;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.003 );
		v[n].y = 0.25;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.25;
		n++;		
	}	

	
	var obj = new THREE.Mesh( fname_s_0220(v), new THREE.MeshPhongMaterial( { color : cdm.color, depthTest: false, transparent: true, lightMap: lightMap_1 } ) ); 
	obj.userData.tag = 'pivot';
	obj.userData.axis = cdm.axis;
	obj.renderOrder = 2;
	obj.position.copy(cdm.pos);
	obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z);
	
	scene.add( obj );
	
	return obj;
}




function fname_s_0252( intersect )
{
	var obj = clickO.move = intersect.object;  
	
	var pivot = infProject.tools.pivot;
	
	var pos = pivot.position.clone();
	
	pivot.userData.pivot.active.startPos = pos;
	
	clickO.offset = new THREE.Vector3().subVectors( pos, intersect.point );
	
	var axis = obj.userData.axis;
	pivot.userData.pivot.active.axis = axis;	
	pivot.updateMatrixWorld();	
	
	
	if(axis == 'x')
	{ 
		var axisO = pivot.userData.pivot.axs.x; 	
	}
	else if(axis == 'z')
	{ 
		var axisO = pivot.userData.pivot.axs.z; 	
	}
	else if(axis == 'y')
	{ 
		var axisO = pivot.userData.pivot.axs.y;	
	}	
		
	
	if(axis == 'xz' || axis == 'center')
	{ 
		planeMath.rotation.set( Math.PI/2, 0, 0 ); 
	}		 
	else
	{
		axisO.updateMatrixWorld();
		pivot.userData.pivot.active.dir = new THREE.Vector3().subVectors( pivot.position, axisO.getWorldPosition(new THREE.Vector3()) ).normalize();	
		pivot.userData.pivot.active.qt = fname_s_0238( pivot.userData.pivot.active.dir );	
		
		planeMath.quaternion.copy( pivot.userData.pivot.active.qt ); 
		planeMath.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)));
	}
	
	planeMath.position.copy( intersect.point );
	
	fname_s_0257({obj: pivot.userData.pivot.obj});
} 





function fname_s_0253( event )
{	
	var intersects = fname_s_0230( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
	}		
	
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
	
	var obj = pivot.userData.pivot.obj;
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );

	if(pivot.userData.pivot.active.axis == 'xz')
	{
		
	}		
	else
	{
		var subV = new THREE.Vector3().subVectors( pos, pivot.userData.pivot.active.startPos );
		var locD = fname_s_0236(subV, pivot.userData.pivot.active.qt);						
		
		var v1 = new THREE.Vector3().addScaledVector( pivot.userData.pivot.active.dir, locD.z );
		pos = new THREE.Vector3().addVectors( pivot.userData.pivot.active.startPos, v1 );			
	}
	
	
	var pos2 = new THREE.Vector3().subVectors( pos, pivot.position );
	pivot.position.add( pos2 );
	gizmo.position.add( pos2 );
	
	obj.position.add( pos2 );
	
	fname_s_0254();
}




function fname_s_0254()
{
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
	
	var pVis = false;
	
	if(gizmo.visible) { pVis = true; }
	if(!pVis) { return; }
	
	var obj = null;
	
	if(pVis) obj = pivot.userData.pivot.obj;
	if(!obj) return;
	
	if(camera == cameraTop)
	{		
		var scale = 1/camera.zoom+0.0;	
		
		pivot.scale.set( scale,scale,scale );
		gizmo.scale.set( scale,scale,scale );
	}
	else
	{
		var dist = camera.position.distanceTo(obj.position); 					
		var scale = dist/6;	
		
		pivot.scale.set( scale,scale,scale );
		gizmo.scale.set( scale,scale,scale );		
	}
}




function fname_s_0255(cdm)
{	
	if(clickO.actMove)
	{	
		fname_s_0345({obj: infProject.tools.pivot.userData.pivot.obj, type: 'move'});
		
		fname_s_0283({obj: infProject.tools.pivot.userData.pivot.obj});	
	}		
}






function fname_s_0256(cdm)
{
	var obj = cdm.obj;
	var rayhit = cdm.rayhit;
	
	if(fname_s_0340( rayhit )) { return; }
	
	obj.updateMatrixWorld();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			 
	
	
	
	if(1==2)	
	{
		var qt = new THREE.Quaternion();
	}
	else		
	{					
		var qt = obj.quaternion.clone();	 		
	}		
	
 
	
	if(infProject.tools.pivot.userData.pivot.obj == obj)
	{
		clickO.move = obj;		
		clickO.offset = new THREE.Vector3().subVectors( obj.position, rayhit.point );
	
		planeMath.position.copy( rayhit.point );
		planeMath.rotation.set( Math.PI/2, 0, 0 );
	}
	
	var pivot = infProject.tools.pivot;	
	pivot.visible = true;	
	pivot.userData.pivot.obj = obj;
	pivot.position.copy(pos);
	pivot.quaternion.copy(qt);
	
	if(camera == cameraTop)
	{
		
		pivot.visible = false;
	}
	else
	{
		pivot.userData.pivot.axs.y.visible = true;
	}	
	
	var gizmo = infProject.tools.gizmo;					
	gizmo.position.copy( pos );		
	gizmo.visible = true;
	gizmo.userData.gizmo.obj = obj;
	gizmo.quaternion.copy( qt );			
	
	fname_s_0254();
	
	if(camera == cameraTop) { fname_s_0208(); }
	if(camera == camera3D) { fname_s_0207({arr: [obj]}); }
	
	fname_s_029({obj: obj});	

	fname_s_070({obj: obj, boxCircle: true, getObjRoom: true, resetPos: true});
	
	getLotIdObject3D(obj.userData.obj3D.lotid);
	
	fname_s_0257({obj: obj});
	
	
	if(obj.userData.obj3D.newO)
	{
		delete obj.userData.obj3D.newO;
		
		fname_s_0347({obj: obj});		
	}
}




function fname_s_0257(cdm)
{
	var obj = cdm.obj;
	
	obj.userData.obj3D.ur.pos = obj.position.clone();
	obj.userData.obj3D.ur.q = obj.quaternion.clone(); 	
}





function fname_s_0258( event )
{	
	var intersects = fname_s_0230( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
	}		
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );

	infProject.tools.pivot.position.add( pos2 );
	infProject.tools.gizmo.position.add( pos2 );

	fname_s_0254();
	
	fname_s_070({obj: obj, boxCircle: true, setPos: { pos2D: new THREE.Vector2(event.clientX, event.clientY), pos3D: intersects[ 0 ].point }});
}



function fname_s_0259(obj)
{ 
	if(clickO.actMove)
	{		 
		fname_s_0283({obj: obj});	
		
		
		fname_s_0345({obj: obj, type: 'move'}); 
		
		if(camera == cameraTop)
		{	
			
			if(1==1)
			{
				var circle = infProject.svg.furn.boxCircle.elem;	

				for ( var i = 0; i < circle.length; i++ )
				{
					var x = ( ( circle[i].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
					var y = - ( ( circle[i].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
					var A = new THREE.Vector3(x, y, -1);
					A.unproject(camera);
					
					circle[i].userData.svg.circle.pos = A;
					
					
				}
				
				
				{	
					var arrP = [];
					var box1 = infProject.svg.furn.box1; 			
						
					for ( var i = 0; i < box1.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box1.userData.svg.path.arrS[i];
						
						var x = ( ( arrS.x - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
						var y = - ( ( arrS.y - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
						var A = new THREE.Vector3(x, y, -1);
						A.unproject(camera);

						arrP[arrP.length] = A;
					}	
							
					arrP[arrP.length] = arrP[0];
					
					box1.userData.svg.path.arrP = arrP;
					
				}
				
				
				{	
					var arrP = [];
					var box2 = infProject.svg.furn.box2; 
					
					for ( var i = 0; i < box2.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box1.userData.svg.path.arrS[i];
						
						var x = ( ( arrS.x - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
						var y = - ( ( arrS.y - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
						var A = new THREE.Vector3(x, y, -1);
						A.unproject(camera);

						arrP[arrP.length] = A;
					}	
							
					arrP[arrP.length] = arrP[0];
					
					box2.userData.svg.path.arrP = arrP;
					
				}


				
				fname_s_0327({el: infProject.svg.furn.offset.elem});
				fname_s_0327({el: infProject.svg.furn.size.elem});
			}
		}
	}	
}


	


function fname_s_0260(cdm)
{ 
	var obj = cdm.obj;	
	
	if(obj.userData.tag != 'obj') return;
	
	var undoRedo = true;
	if(cdm.undoRedo !== undefined) { undoRedo = cdm.undoRedo; }	
	if(undoRedo) { fname_s_0346({obj: obj}); }
	
	clickO = resetPop.clickO(); 
	
	fname_s_0261(obj);
	
	var arr = [];
	
	arr[0] = obj;
	
	for(var i = 0; i < arr.length; i++)
	{	
		if(arr[i].userData.cubeCam)
		{
			fname_s_0155({arr : infProject.scene.array.cubeCam, o : arr[i].userData.cubeCam});
			fname_s_0192( arr[i].userData.cubeCam );
			scene.remove( arr[i].userData.cubeCam );
		}
		fname_s_0155({arr : infProject.scene.array.obj, o : arr[i]});
		fname_s_027({uuid: arr[i].uuid, type: 'delete'});
		fname_s_0192(arr[i]);
		scene.remove(arr[i]); 
	}
	
	fname_s_0208();
}




function fname_s_0261(obj)
{
	if(!obj) return;
	if(!obj.userData.tag) return;	
	
	
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
				
	
	if(clickO.rayhit)
	{
		if(pivot.userData.pivot.obj == clickO.rayhit.object) return;		
		if(clickO.rayhit.object.userData.tag == 'pivot') return;
		
		if(gizmo.userData.gizmo.obj == clickO.rayhit.object) return;		
		if(clickO.rayhit.object.userData.tag == 'gizmo') return;
	}	
	
	
	
	pivot.visible = false;
	gizmo.visible = false;
	
	pivot.userData.pivot.obj = null;
	gizmo.userData.gizmo.obj = null;

	fname_s_0329(infProject.svg.furn.boxCircle.elem);
	fname_s_0329([infProject.svg.furn.box1]);
	fname_s_0329([infProject.svg.furn.box2]);
	fname_s_0329(infProject.svg.furn.size.elem);
	fname_s_0329(infProject.svg.furn.offset.elem);
	
	fname_s_0332(infProject.html.furn.size);
	fname_s_0332(infProject.html.furn.offset);
	
	
	clickO.last_obj = null;
	
	fname_s_029(); 	
	
	fname_s_0208();
}



 




function fname_s_0262(cdm)
{
	var obj = null;
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;	
	
	if(infProject.settings.active.pg == 'pivot'){ obj = pivot.userData.pivot.obj; }	
	if(infProject.settings.active.pg == 'gizmo'){ obj = gizmo.userData.gizmo.obj; }
	
	return obj;	
}






function fname_s_0263(cdm) 
{
	var obj = fname_s_0262();
	
	if(!obj) return;	
	
	var cubeCam = null;
	if(obj.userData.cubeCam) 
	{ 
		cubeCam = obj.userData.cubeCam;
		obj.userData.cubeCam = null;
	}
	
	var clone = obj.clone();
	
	if(cubeCam)
	{
		obj.userData.cubeCam = cubeCam;
	}

	clone.userData.id = countId; countId++;
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = clone; 
	scene.add( clone );	

	
	 
	
	
	
	
}




function fname_s_0264(cdm)
{
	var obj = fname_s_0262();
	
	if(!obj) return;


	var obj_1 = obj;		
	var diff_2 = obj_1.quaternion.clone().inverse();					
	var arr_2 = [obj_1];
	
	
	
	for(var i = 0; i < arr_2.length; i++)
	{
		arr_2[i].quaternion.premultiply(diff_2);		
		arr_2[i].updateMatrixWorld();		
	}
	
	
	var centerObj = obj_1.position.clone();
	

	
	for(var i = 0; i < arr_2.length; i++)
	{
		arr_2[i].position.sub(centerObj);
		arr_2[i].position.applyQuaternion(diff_2); 	
		arr_2[i].position.add(centerObj);
	}
	

	
	if(infProject.settings.active.pg == 'pivot'){ var tools = infProject.tools.pivot; }	
	if(infProject.settings.active.pg == 'gizmo'){ var tools = infProject.tools.gizmo; }	
}






function fname_s_0265()
{
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 1 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.9 );
		v[n].y = 0;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.99 );
		v[n].y = 0.01;
		n++;	
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.9 );
		v[n].y = 0.01;
		n++;		
	}	

	var gizmo = new THREE.Object3D();
	gizmo.userData.gizmo = {};
	gizmo.userData.gizmo.obj = null;
	gizmo.userData.gizmo.active = { axis: '', startPos: new THREE.Vector3(), rotY: 0 };
	
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	var cdm = {axis: 'x', pos: new THREE.Vector3(0,0.0,0), rot: new THREE.Vector3(0,0,0), color: 0x00ff00};
	
	var obj = new THREE.Mesh( fname_s_0220(v), material ); 
	obj.userData.tag = 'gizmo';
	obj.userData.axis = cdm.axis;
	obj.renderOrder = 2;
	obj.position.copy(cdm.pos);
	obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z);		
	gizmo.add( obj );
	
	gizmo.visible = false;
	scene.add( gizmo );
	
	return gizmo;
}	




function fname_s_0266( intersect )
{			
	var gizmo = infProject.tools.gizmo;
	
	clickO.move = intersect.object; 	

	var obj = gizmo.userData.gizmo.obj;			
	var axis = intersect.object.userData.axis;
	gizmo.userData.gizmo.active.axis = axis;
	
	
	
	obj.updateMatrixWorld();
	gizmo.userData.gizmo.active.startPos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			

	
	if(axis == 'y')
	{
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = -Math.PI/2;
	}	
	else if(axis == 'z')
	{	
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = Math.PI;
	}
	else if(axis == 'x')
	{
		var dr = new THREE.Vector3( 1, 0, 0 );
		var rotY = Math.PI/2;
	}

	
	planeMath.position.copy( gizmo.position );		
	
	if(camera == cameraTop)
	{
		planeMath.rotation.set(Math.PI/2, 0, 0);
	}
	else
	{
		fname_s_0267(obj, dr, rotY, false);
	}
	
	
	function fname_s_0267(obj, dr, rotY, global)
	{
		if(global)	
		{
			planeMath.quaternion.copy( new THREE.Quaternion().setFromAxisAngle( dr, rotY ) );
		}
		else		
		{
			var quaternion = new THREE.Quaternion().setFromAxisAngle( dr, rotY );							
			var q2 = obj.getWorldQuaternion(new THREE.Quaternion()).clone().multiply( quaternion );			
			planeMath.quaternion.copy( q2 );																		
		}
	}

	
	planeMath.updateMatrixWorld();
	var dir = planeMath.worldToLocal( intersect.point.clone() );	
	gizmo.userData.gizmo.active.rotY = Math.atan2(dir.x, dir.y);

	fname_s_0257({obj: gizmo.userData.gizmo.obj});
}




function fname_s_0268( event )
{	
	var intersects = fname_s_0230( event, planeMath, 'one' );	 	 
	if(intersects.length == 0) return;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
	}	
	
	
	var gizmo = infProject.tools.gizmo;
	var pivot = infProject.tools.pivot;
	
	var obj = gizmo.userData.gizmo.obj;  
	var axis = gizmo.userData.gizmo.active.axis;
	
	if(axis == 'x'){ var dr = new THREE.Vector3( 0, 1, 0 ); }
	else if(axis == 'y'){ var dr = new THREE.Vector3( 1, 0, 0 ); }
	else if(axis == 'z'){ var dr = new THREE.Vector3( 0, 0, 1 ); }
	
	
	
	var dir = planeMath.worldToLocal( intersects[ 0 ].point.clone() );	
	var rotY = Math.atan2(dir.x, dir.y);
	
	
	
	if(camera == cameraTop) 
	{ 
		obj.rotateOnWorldAxis(new THREE.Vector3(0,1,0), rotY - gizmo.userData.gizmo.active.rotY);

		fname_s_070({obj: obj, boxCircle: true});
	}
	else 
	{ 		
		fname_s_0269({obj: [obj], dr: dr, rotY: rotY, centerO: obj});		 
	}		
	
	
	function fname_s_0269(cdm)
	{
		var centerO = cdm.centerO;
		var arr = cdm.obj;
		var dr = cdm.dr;
		var rotY = cdm.rotY;		
		
		centerO.updateMatrixWorld();		
		var v1 = centerO.localToWorld( dr.clone() );
		var v2 = centerO.getWorldPosition(new THREE.Vector3());
		var dir = new THREE.Vector3().subVectors(v1, v2).normalize();	

		for(var i = 0; i < arr.length; i++)
		{
			arr[i].position.sub(gizmo.userData.gizmo.active.startPos);
			arr[i].position.applyAxisAngle(dir, rotY - gizmo.userData.gizmo.active.rotY); 
			arr[i].position.add(gizmo.userData.gizmo.active.startPos);				
			
			arr[i].rotateOnWorldAxis(dir, rotY - gizmo.userData.gizmo.active.rotY);								
		}		
	}
	
			
	
	gizmo.userData.gizmo.active.rotY = rotY; 
	
	gizmo.rotation.copy( obj.rotation );
	pivot.rotation.copy( obj.rotation );

	
}



function fname_s_0270(cdm)
{	
	if(clickO.actMove)
	{	
		fname_s_0345({obj: infProject.tools.gizmo.userData.gizmo.obj, type: 'move'});
	}		
}





async function fname_s_0271()
{
	var url = infProject.settings.api.list;
	
	var arr = [];

	if(window.location.hostname == 'localtest.vim.myplan.pro' || window.location.hostname == 'remstok'){ var url = 't/list_model.json'; }
	
	var response = await fetch(url, { method: 'GET' });
	var json = await response.json();
	
	for(var i = 0; i < json.length; i++)
	{		
		var url_2 = infProject.settings.api.models+json[i].model;
		
		if(window.location.hostname == 'localtest.vim.myplan.pro' || window.location.hostname == 'remstok'){ var url_2 = 'import/catalog/'+json[i].model; }
		
		arr[i] = { lotid: json[i].id, name: json[i].title, url: url_2, planeMath : 0.0, glb : true, spot: json[i].spot, height: json[i].height };		
	}		

	
	
		if(1==1)
	{
		arr[arr.length] =
		{
			lotid : 32,
			url : infProject.path+'import/glb/wd/okno1x1.glb', 
			name : 'окно 1',
			type: 'wd',
			planeMath : 1.5,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 33,
			url : infProject.path+'import/glb/wd/dver2x1.glb', 
			name : 'дверь',
			type: 'wd',
			planeMath : 0.1,
			glb : true,
			stopUI: true,
		};		
	};
		
	arr[arr.length] =
	{
		lotid : 4,
		url : infProject.path+'import/vm_door_1.fbx', 
		name : 'дверь',
		type: 'wd',
		planeMath : 1.0,
		material : true,
		stopUI: true,
	};

	arr[arr.length] =
	{
		lotid : 8,
		url : infProject.path+'import/vm_light_point_1.fbx', 
		name : 'светильник',
		type: 'light point',
		planeMath : infProject.settings.height - 0.05,
	};

		if(1==1)
	{
		arr[arr.length] =
		{
			lotid : 11,
			url : infProject.path+'import/glb/спальня/80105983_krovat_dafna10.glb', 
			name : 'кровать',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 12,
			url : infProject.path+'import/glb/спальня/80274115_Пуф_ПФ-1.glb', 
			name : 'Пуф_ПФ',
			planeMath : 0.0,
			glb : true,
					};

		arr[arr.length] =
		{
			lotid : 13,
			url : infProject.path+'import/glb/спальня/80286563_Туалетный_стол_Sherlock.glb', 
			name : 'Туалетный_стол',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 14,
			url : infProject.path+'import/glb/спальня/80318441_Кровать_с_подъёмным_механизмом_Paola.glb', 
			name : 'Кровать_с_подъёмным_механизмом',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 15,
			url : infProject.path+'import/glb/спальня/80318442_Тумба_прикроватная_Paola.glb', 
			name : 'Тумба_прикроватная',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 16,
			url : infProject.path+'import/glb/спальня/80318445_Зеркало_навесное_Paola.glb', 
			name : 'Зеркало_навесное',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 17,
			url : infProject.path+'import/glb/спальня/80328489_Шкаф-купе_Home_Стандарт_160_см.glb', 
			name : 'Шкаф-купе_Стандарт_160_см',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};
		
	};
		
	
		if(1==1)
	{
		arr[arr.length] =
		{
			lotid : 18,
			url : infProject.path+'import/glb/кухня/80310580_Стол_Мюнхен.glb', 
			name : 'Стол_Мюнхен',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};
		
		arr[arr.length] =
		{
			lotid : 19,
			url : infProject.path+'import/glb/кухня/80320714_Стул_Новара.glb', 
			name : 'Стул_Новара',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};	

		arr[arr.length] =
		{
			lotid : 20,
			url : infProject.path+'import/glb/кухня/80321220_Кухонный_гарнитур_Софи.glb', 
			name : 'Кухонный_гарнитур_Софи',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};		
	};
		
		if(1==1)
	{
		arr[arr.length] =
		{
			lotid : 21,
			url : infProject.path+'import/glb/прихожая/80288366_Тумба_для_обуви_Гранада.glb', 
			name : 'Тумба_для_обуви_Гранада 1',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};
		
		arr[arr.length] =
		{
			lotid : 22,
			url : infProject.path+'import/glb/прихожая/80288367_Шкаф_для_одежды_Гранада.glb', 
			name : 'Шкаф_для_одежды_Гранада',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 23,
			url : infProject.path+'import/glb/прихожая/80288368_Тумба_для_обуви_Гранада.glb', 
			name : 'Тумба_для_обуви_Гранада 2',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 24,
			url : infProject.path+'import/glb/прихожая/80311598_Шкаф-купе_2-дверный_Slide_120х220_см.glb', 
			name : 'Шкаф-купе_2-дверный',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};		
	};
		
	
		if(1==1)
	{
		arr[arr.length] =
		{
			lotid : 25,
			url : infProject.path+'import/glb/зал/80088931_Комод_НК-3.glb', 
			name : 'Комод_НК-3',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};
		
		arr[arr.length] =
		{
			lotid : 26,
			url : infProject.path+'import/glb/зал/80295027_Стеллаж_Стенли.glb', 
			name : 'Стеллаж_Стенли',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 27,
			url : infProject.path+'import/glb/зал/80310320_Шкаф-купе_3-дверный_Slide_210х220_см.glb', 
			name : 'Шкаф-купе_3-дверный_Slide_210х220_см',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 28,
			url : infProject.path+'import/glb/зал/80311525_Кресло_рабочее_Boss_II.glb', 
			name : 'Кресло_рабочее_Boss_II',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 29,
			url : infProject.path+'import/glb/зал/80322444_Журнальный_стол_Лофт.glb', 
			name : 'Журнальный_стол_Лофт',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};

		arr[arr.length] =
		{
			lotid : 30,
			url : infProject.path+'import/glb/зал/80327766_Угловой_диван-кровать_Вольберг.glb', 
			name : 'Угловой_диван-кровать_Вольберг',
			planeMath : 0.0,
			glb : true,
					};

		arr[arr.length] =
		{
			lotid : 31,
			url : infProject.path+'import/glb/зал/80328867_Письменный_стол_Рокс.glb', 
			name : 'Письменный_стол_Рокс',
			planeMath : 0.0,
			glb : true,
			stopUI: true,
		};		
				
	};
	
	
	infProject.catalog.obj = arr;
	fname_s_022(); 
	
}




function fname_s_0272()
{
	var arr = [];	 	
	
	arr[0] =
	{
		url : infProject.path+'img/load/floor_1.jpg', 
	};
	
	arr[1] =
	{
		url : infProject.path+'img/load/w1.jpg', 
	};

	arr[2] =
	{
		url : infProject.path+'img/load/kirpich.jpg', 
	};

	arr[3] =
	{
		url : infProject.path+'img/load/beton.jpg', 
	};	

	arr[4] =
	{
		url : infProject.path+'img/load/w2.jpg', 
	};

	arr[5] =
	{
		url : infProject.path+'img/load/f1.jpg', 
	};

	arr[6] =
	{
		url : infProject.path+'img/load/f2.jpeg', 
	};

	arr[7] =
	{
		url : infProject.path+'img/load/f3.jpg', 
	};	
	
	return arr;
}


function fname_s_0273(cdm)
{
	var lotid = cdm.lotid;
	
	
	for(var i = 0; i < infProject.catalog.obj.length; i++)
	{
		if(lotid == infProject.catalog.obj[i].lotid)
		{  
			return infProject.catalog.obj[i];
		}
	}
	
	return null;
}



function fname_s_0274(cdm)
{ 
				
	if(!cdm.lotid) return;
	
	var lotid = cdm.lotid;
	
	var inf = fname_s_0273({lotid: lotid});

	if(!inf) return;		
	var obj = fname_s_0275({lotid: lotid});
	
	if(cdm.loadFromFile){ obj = null; }
	
	if(obj)			{ 
		inf.obj = obj.clone();
		
		if(obj) { fname_s_0279(inf, cdm); }
	}
	else			{
		
		if(cdm.loadFromFile){}
		else { fname_s_0277(inf, cdm); }
		
		if(inf.glb)
		{ 
			var loader = new THREE.GLTFLoader();
			loader.load( inf.url, function ( object ) 						
			{ 
				var obj = object.scene.children[0];
				
				var obj = fname_s_0276({lotid: lotid, inf: inf, obj: obj});
				
				if(cdm.loadFromFile)					{
					fname_s_0202({lotid: lotid, furn: cdm.furn});
				}
				else									{
					inf.obj = obj;
					
					fname_s_0279(inf, cdm);							
				}
			});				
		}
		else
		{
			var loader = new THREE.FBXLoader();
			loader.load( inf.url, function ( object ) 						
			{ 
								
				var obj = object.children[0];
				
				var obj = fname_s_0276({lotid: lotid, inf: inf, obj: obj});
				
				if(cdm.loadFromFile)					{
					fname_s_0202({lotid: lotid, furn: cdm.furn});
				}
				else									{
					inf.obj = obj;
					
					fname_s_0279(inf, cdm);							
				}
			});			
		}	
	}
	
	
}





function fname_s_0275(cdm)
{
	var lotid = cdm.lotid;									var arrObj = infProject.scene.array.base;			
	for(var i = 0; i < arrObj.length; i++)
	{
		if(arrObj[i].lotid == lotid)
		{
			return arrObj[i].obj;
		}

	}
	
	return null;
}



function fname_s_0276(cdm)
{
	var lotid = cdm.lotid;									var obj = cdm.obj;
	var base = infProject.scene.array.base;				
	for(var i = 0; i < base.length; i++)
	{
		if(base[i].lotid == lotid)
		{  
			return obj;
		}
	}
	
	
	obj.geometry.computeBoundingBox();	
	
	var geometries = [];
	
		obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			if(1==2)
			{
				child.updateMatrix();
				child.updateMatrixWorld();
				child.parent.updateMatrixWorld();							
				
				var geometry = child.geometry.clone();
				geometry.applyMatrix4(child.parent.matrixWorld);
				geometries.push(geometry);										
			}
			
			if(infProject.settings.obj.material.texture == 'none')
			{
				child.material.map = null;
				child.material.color = new THREE.Color(infProject.settings.obj.material.color);				
			}
			if(child.material.map) 
			{
											}
			child.castShadow = true;	
			child.receiveShadow = true;				
		}
	});	
	
	
	if(1==2)
	{
		var mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([obj.geometry]); 
		var mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([obj.children[0].geometry]);
		
		
		
						
			}
	
	base[base.length] = {lotid: lotid, obj: obj.clone()};

	return obj;
}


function fname_s_0277(inf, cdm)
{ 
	if(!inf.spot) return;
	if(!inf.spot.coordinates) return;
	
	var v = inf.spot.coordinates[0];
	var height = (inf.height) ? inf.height : 0.1;
	
	var point = [];
	for ( var i = 0; i < v.length - 1; i++ ) 
	{  
		point[i] = new THREE.Vector2 ( v[i][0], v[i][1] );		
	}	 	
	
	var geometry = new THREE.ExtrudeGeometry( new THREE.Shape(point), { bevelEnabled: false, depth: height } );
	geometry.rotateX(-Math.PI / 2);
	geometry.rotateY(Math.PI);
	var material = new THREE.MeshPhongMaterial( { color: 0xe3e3e5, transparent: true, opacity: 0.8 } );
	
	
	var obj = new THREE.Mesh( geometry, material ); 
	
	infProject.scene.array.objSpot[infProject.scene.array.objSpot.length] = obj;
	
	scene.add(obj);
	
	obj.userData.tag = 'obj_spot';
	obj.userData.objSpot = {};
	
	if(cdm.id) { obj.userData.objSpot.id = cdm.id; }	
	if(cdm.pos) { obj.position.copy(cdm.pos); }
	if(cdm.q) { obj.quaternion.copy(cdm.q); }
	
	if(cdm.cursor) { clickO.move = obj; }
}



function fname_s_0278(cdm)
{ 
	var obj = null;	
	
	if(cdm.obj)
	{ 
		obj = cdm.obj; 
	}
	else if(cdm.id)
	{
		var arr = infProject.scene.array.objSpot;
		
		for ( var i = 0; i < arr.length; i++ )
		{
			if(arr[i].userData.objSpot.id == cdm.id)
			{
				obj = arr[i];
				break;
			}
		}
	}
	
	if(!obj) return;
	if(obj.userData.tag != 'obj_spot') return;
	
	fname_s_0155({arr: infProject.scene.array.objSpot, o: obj});
	fname_s_0192(obj);
	scene.remove(obj); 
}



function fname_s_0279(inf, cdm)
{
		if(cdm.wd)
	{  
		fname_s_065(inf, cdm);
		return;
	}
	
	var obj = inf.obj;
	
	if(cdm.pos){ obj.position.copy(cdm.pos); }
	else if(inf.planeMath)
	{ 
		obj.position.y = inf.planeMath;
		planeMath.position.y = inf.planeMath; 
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld(); 
	}
	
		if(cdm.q){ obj.quaternion.set(cdm.q.x, cdm.q.y, cdm.q.z, cdm.q.w); }
	

	if(cdm.id){ obj.userData.id = cdm.id; }
	else { obj.userData.id = countId; countId++; }
	
	obj.userData.tag = 'obj';
	obj.userData.obj3D = {};
	obj.userData.obj3D.lotid = cdm.lotid;
	obj.userData.obj3D.nameRus = inf.name;
	obj.userData.obj3D.typeGroup = '';
	obj.userData.obj3D.helper = null;
	
	obj.userData.obj3D.ur = {};
	obj.userData.obj3D.ur.pos = new THREE.Vector3();
	obj.userData.obj3D.ur.q = new THREE.Quaternion();
	
	if(!cdm.id){ obj.userData.obj3D.newO = true; }
	
	obj.geometry.computeBoundingBox();	
	
		if(1==1)
	{
		var x = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var z = obj.geometry.boundingBox.max.z - obj.geometry.boundingBox.min.z;	
		obj.userData.obj3D.box = new THREE.Vector3(x, 1, z);
	}	
	

	if(inf.type)
	{
		if(inf.type == 'light point')
		{
			var intensity = 1;
			if(cdm.light)
			{
				if(cdm.light.intensity) { intensity = cdm.light.intensity; }
			}
			fname_s_0280({obj: obj, intensity: intensity}); 
		}
	}
	
	obj.material.visible = false;

	
			
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );
	 
	fname_s_027({o: obj, type: 'add'});		
	
	
	if(cdm.cursor) 		{ 
		fname_s_0278({obj: clickO.move});
		clickO.move = obj; 
	} 
	else		{
		fname_s_0278({id: obj.userData.id});
	}
	
	renderCamera();
}


function fname_s_0280(cdm)
{
	var obj = cdm.obj;
	obj.userData.obj3D.typeGroup = 'light point';
	
	
	var light = new THREE.PointLight( 0xffffff, cdm.intensity, 10 );
	
	light.castShadow = true;            	scene.add( light );
	
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			child.castShadow = false;	
			child.receiveShadow = false;				
		}
	});	
	
	light.decay = 2;

		light.shadow.mapSize.width = 1048;  	light.shadow.mapSize.height = 1048; 	light.shadow.camera.near = 0.01;       	light.shadow.camera.far = 10;      	
	light.position.set(0, -0.01, 0);

	if(infProject.settings.light.type == 'global')
	{
		light.visible = false;
	}
	
	
	obj.add( light );

	infProject.scene.light.lamp[infProject.scene.light.lamp.length] = light;
	
	
	if(1==2)
	{
		var spotLight = new THREE.SpotLight( 0xffffff );	

		spotLight.castShadow = true;

		spotLight.angle = Math.PI / 2 - 0.1;
		spotLight.penumbra = 0.05;
		spotLight.decay = 2;
		spotLight.distance = 10;	

		spotLight.castShadow = true;
		spotLight.shadow.mapSize.width = 4048;
		spotLight.shadow.mapSize.height = 4048;
		spotLight.shadow.camera.near = 0.01;
		spotLight.shadow.camera.far = 10;


		
		if(1==2)
		{
			scene.add( spotLight );
			scene.add( spotLight.target );
			
			spotLight.position.copy(obj.position);
			spotLight.target.position.set(obj.position.x, -1, obj.position.z);		
		}
		else
		{
			spotLight.position.set(0, -0.05, 0);
			spotLight.target.position.set(0, -1, 0);		
			
			obj.add( spotLight );
			obj.add( spotLight.target );	
		}
		
		
		
		if(1==1)
		{
			spotLightCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
			scene.add( spotLightCameraHelper );	

			spotLightHelper = new THREE.SpotLightHelper( spotLight );
			scene.add( spotLightHelper );		

			obj.userData.obj3D.helper = [spotLightCameraHelper];
		}
		
	}

}


function fname_s_0281(cdm)
{
	var obj = cdm.obj;
	var arrCubeO = [];
	
	obj.traverse(function(child) 
	{
		if(child.isMesh && child.material) 
		{ 
			if(new RegExp('mirror','i').test( child.material.name )) 
			{  								
				child.material.userData.type = 'mirror';			
				arrCubeO[arrCubeO.length] = child;		 									
			}
			else if(new RegExp('glass','i').test( child.material.name )) 
			{  								
				child.material.userData.type = 'glass';			
				child.material.opacity = 0.1;	
				child.material.transparent = true;
				child.material.side = THREE.DoubleSide;	
			}			
		}
	});

	if(arrCubeO.length > 0) fname_s_0282({obj: obj, arrO: arrCubeO});		
	
}


function fname_s_0282(cdm)
{
	var obj = cdm.obj;
	var arrO = cdm.arrO;
	
	var cubeCam = new THREE.CubeCamera(0.1, 100, 1024);					
	scene.add(cubeCam); 

	infProject.scene.array.cubeCam[infProject.scene.array.cubeCam.length] = obj;
	obj.userData.cubeCam = cubeCam;

	 
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			if(child.material)
			{
				if(child.material.userData.type == 'mirror')
				{
					child.material.envMap = cubeCam.renderTarget.texture;
																									child.material.metalness = 1;
					child.material.roughness = 0;
									}								
			}				
		}
	});	
	
	fname_s_0283({obj: obj});
}


function fname_s_0283(cdm)
{
	var obj = cdm.obj;
	if(!obj) return;
	if(!obj.userData.cubeCam) return;
	
	var cubeCam = obj.userData.cubeCam;					
				
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );	
	cubeCam.position.copy(pos);
	
	obj.visible = false;
	cubeCam.update( renderer, scene );			
	obj.visible = true;
}




function fname_s_0284(cdm)
{

	if(1==1)		{
		var loader = new THREE.GLTFLoader();
		loader.parse( cdm.data, '', function ( obj ) 						
		{ 
						fname_s_0286({obj: obj.scene});
		});
		
	}
	else		{
		var loader = new THREE.FBXLoader();
		var obj = loader.parse( cdm.data );		
		fname_s_0286({obj: obj});			
	}


}


function fname_s_0285()
{	
	var url = $('[nameId="input_link_obj_1"]').val(); 
	var url = url.trim();
	
				
	if(1==1)		{
		var loader = new THREE.GLTFLoader();
		loader.load( url, function ( obj ) 						
		{ 
						fname_s_0286({obj: obj.scene});
		});			
	}
	else		{
		var loader = new THREE.FBXLoader();
		loader.load( url, function ( obj ) 						
		{ 			
			fname_s_0286({obj: obj});
		});			
	}
}





function fname_s_0286(cdm)
{
	$('[nameId="window_main_load_obj"]').css({"display":"none"});
		
	var obj = cdm.obj;
	
	var obj = obj.children[0];		
	obj.position.y = 1;	

	planeMath.position.y = 1; 
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.updateMatrixWorld(); 	
	
	obj.userData.tag = 'obj';
	obj.userData.obj3D = {};
	obj.userData.obj3D.lotid = 0;
	obj.userData.obj3D.nameRus = 'неизвестный объект';
	obj.userData.obj3D.typeGroup = '';
 
	
	
		obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			child.castShadow = true;	
			child.receiveShadow = true;				
		}
	});			

	obj.material.visible = false;		
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );
	
	
		fname_s_0281({obj: obj});

	
	if(1==2)
	{
		var options = 
		{
			trs: true,
			onlyVisible: false,
			truncateDrawRange: true,
			binary: true,
			forceIndices: false,
			forcePowerOfTwoTextures: false,
			maxTextureSize: Number( 20000 ) 
		};
	
		var exporter = new THREE.GLTFExporter();

				exporter.parse( [obj], function ( gltf ) 
		{
			
			var link = document.createElement( 'a' );
			link.style.display = 'none';
			document.body.appendChild( link );			
			
			if ( gltf instanceof ArrayBuffer ) 
			{ 
				 
				link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'application/octet-stream' } ) );
				link.download = 'file.glb';				
			}
			else
			{
				
				var gltf = JSON.stringify( gltf, null, 2 );
				
				link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'text/plain' } ) );
				link.download = 'file.gltf';				
			}

			link.click();			
			
		}, options );
		
	}
	

					
	fname_s_027({o: obj, type: 'add'});		
		
	renderCamera();	
}










var wallVisible = [];


function fname_s_0287()
{
	wallVisible = [];
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < wall.length; i++ )
	{	
		var room = fname_s_0183( wall[i] );
		if(room.length == 1) 
		{ 	
			var side = 0;
			for ( var i2 = 0; i2 < room[0].w.length; i2++ ) { if(room[0].w[i2] == wall[i]) { side = room[0].s[i2]; break; } }
			
			if(side == 0) { var n1 = 0; var n2 = 1; }
			else { var n1 = 1; var n2 = 0; }
			
			var x1 = wall[i].userData.wall.p[n2].position.z - wall[i].userData.wall.p[n1].position.z;
			var z1 = wall[i].userData.wall.p[n1].position.x - wall[i].userData.wall.p[n2].position.x;	
			var dir = new THREE.Vector3(x1, 0, z1).normalize();									
			wallVisible[wallVisible.length] = { wall : wall[i], normal : dir };  
		}
	}	
}



function fname_s_0288()
{ 
	var camPos = camera.getWorldDirection(new THREE.Vector3());
	
	camPos = new THREE.Vector3(camPos.x, 0, camPos.z).normalize();
	
	for ( var i = 0; i < wallVisible.length; i++ )
	{
		var wall = wallVisible[ i ].wall;		
		
		var res = camPos.dot( wallVisible[ i ].normal.clone() );
		
						
		if ( res > 0.5 )  
		{ 	
			wall.renderOrder = Math.abs(res);
			wall.userData.wall.show = false;
			fname_s_0290({obj: wall, value: 1 - Math.abs(res)});
			
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
			{
				wall.userData.wall.arrO[i2].visible = false;				
			}
		}
		else
		{
			wall.renderOrder = 0;
			wall.userData.wall.show = true;
			fname_s_0290({obj: wall, value: 1});
			
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
			{
				wall.userData.wall.arrO[i2].visible = true;
			}
		}
	}
}


function fname_s_0289()
{		
	for ( var i = 0; i < wallVisible.length; i++ ) 
	{ 
		var wall = wallVisible[i].wall;

		wall.renderOrder = 0;
		wall.userData.wall.show = true;
		fname_s_0290({obj: wall, value: 1});
		
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
		{
			wall.userData.wall.arrO[i2].visible = true;
		}		
	}
}


function fname_s_0290(cdm)
{
	var obj = cdm.obj;
	
	if(!Array.isArray(obj.material)) { var arrM = [obj.material]; }
	else { var arrM = obj.material; }
	
	for( var i = 0; i < arrM.length; i++ ) 
	{
				if(cdm.value)
		{
			var value = (arrM[i].userData.opacity < cdm.value) ? arrM[i].userData.opacity : cdm.value;
			
			arrM[i].opacity = value;
		}
		
				if(cdm.default)
		{
			arrM[i].opacity = arrM[i].userData.opacity;
		}		
	}
	
}











function fname_s_0291()
{	
	var ruler = [];
	
	var material = new THREE.MeshPhongMaterial( { color : 0x00ff00, transparent: true, opacity: 1, lightMap : lightMap_1 } );
	
	ruler[0] = new THREE.Mesh(infProject.geometry.cone[0], material);
	ruler[0].rotation.set(-Math.PI/2,0,0);
	ruler[0].userData.tag = "substrate_tool";
	ruler[0].userData.subtool = {};
	ruler[0].userData.subtool.num = 1;
	ruler[0].userData.subtool.line = null;
	ruler[0].visible = false;
	scene.add( ruler[0] );
	ruler[0].position.y = 0.01;	

	
	ruler[1] = new THREE.Mesh(infProject.geometry.cone[0], material);
	ruler[1].rotation.set(-Math.PI/2,0,Math.PI);
	ruler[1].userData.tag = "substrate_tool";
	ruler[1].userData.subtool = {};
	ruler[1].userData.subtool.num = 2;
	ruler[1].userData.subtool.line = null;
	ruler[1].visible = false;
	scene.add( ruler[1] );
	ruler[1].position.y = 0.01;
	ruler[1].position.x = 1;	


	
	var line = new THREE.Mesh( fname_s_0216(1, 0.01, 0.01), new THREE.MeshPhongMaterial( { color : 0x00ff00, lightMap : lightMap_1 } ) );
	var v = line.geometry.vertices; 
	v[0].y = v[3].y = v[4].y = v[7].y = -0.005;
	v[1].y = v[2].y = v[5].y = v[6].y = 0.005;			
	line.geometry.verticesNeedUpdate = true;	
	line.visible = false;
	scene.add( line );	
	
	ruler[0].userData.subtool.line = line;
	ruler[1].userData.subtool.line = line;
	 	 
	
	fname_s_0292({ruler: ruler});

	return ruler;
}




function fname_s_0292(cdm)
{
	var ruler = cdm.ruler;
	var line = ruler[0].userData.subtool.line;
	
	var dist = ruler[0].position.distanceTo( ruler[1].position );
	
	var v = line.geometry.vertices;
	v[3].x = v[2].x = v[5].x = v[4].x = dist;
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	line.geometry.verticesNeedUpdate = true; 
	line.geometry.elementsNeedUpdate = true;
	line.geometry.computeBoundingBox();
	line.geometry.computeBoundingSphere();	
	
	line.position.copy(ruler[0].position);
	
	
	var dir = new THREE.Vector3().subVectors( ruler[0].position, ruler[1].position ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	line.rotation.set(0, angleDeg + Math.PI / 2, 0);
	
	ruler[0].rotation.set(-Math.PI/2, 0, angleDeg + Math.PI);
	ruler[1].rotation.set(-Math.PI/2, 0, angleDeg);
	
	$('[nameId="input_size_substrate"]').val( Math.round(dist*100)/100 );
}



function fname_s_0293()
{
	var plane = infProject.scene.substrate.active;
	if(!plane) return;
	
	var ruler = infProject.scene.substrate.ruler;
	ruler[0].position.set(plane.position.x + 0.5, plane.position.y + 0.01, plane.position.z);
	ruler[1].position.set(plane.position.x - 0.5, plane.position.y + 0.01, plane.position.z);

	fname_s_0292({ruler: ruler});	
}



function fname_s_0294(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var obj = new THREE.Mesh( fname_s_0216(5, 0.005, 5), new THREE.MeshPhongMaterial( { color : 0xcccccc, transparent: true, opacity: 1, lightMap : lightMap_1 } ) );
	obj.position.y = 0.01;
	obj.rotation.y = 0.0;
	obj.userData.tag = "substrate";
	obj.userData.substrate = { p: [], active: false, img: false };
	obj.visible = false;
	fname_s_0301({obj: obj, img: 'img/UV_Grid_Sm.jpg'}); 
	scene.add( obj );	
	
	if(cdm.pos)
	{
		if(cdm.pos.x) obj.position.x = cdm.pos.x;
		if(cdm.pos.y) obj.position.y = cdm.pos.y;
		if(cdm.pos.z) obj.position.z = cdm.pos.z;
	}
		
	var p = fname_s_0295({plane: obj});
	
	p[0].userData.subpoint = {plane: obj, x: p[1], z: p[3], p2: p[2], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	p[1].userData.subpoint = {plane: obj, x: p[0], z: p[2], p2: p[3], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	p[2].userData.subpoint = {plane: obj, x: p[3], z: p[1], p2: p[0], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	p[3].userData.subpoint = {plane: obj, x: p[2], z: p[0], p2: p[1], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	
	obj.userData.substrate.p = p;
	
	var n = infProject.scene.substrate.floor.length;
	infProject.scene.substrate.floor[n] = {plane: obj, point: p};
	infProject.scene.substrate.active = null;  
}





function fname_s_0295(cdm)
{	
	var plane = cdm.plane;
	
	function fname_s_0296()
	{
		var count = 48;
		var circle = [];
		var g = (Math.PI * 2) / count;
		
		for ( var i = 0; i < count; i++ )
		{
			var angle = g * i;
			circle[i] = new THREE.Vector3();
			circle[i].x = Math.sin(angle);
			circle[i].z = Math.cos(angle);
			
		}

		return circle;
	}
	
	var circle = fname_s_0296();
	
	var n = 0;
	var v = [];
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.1 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = 0;
		n++;
		
		v[n] = v[n - 2].clone();
		v[n].y = 0.01;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.01;
		n++;		
	}	

	var arr = [];
	var geometry = fname_s_0220(v);
	var material = new THREE.MeshLambertMaterial( { color : 0x333333, transparent: true, opacity: 1, lightMap : lightMap_1 } );
	
	
	for ( var i = 0; i < 4; i++ )
	{
		var obj = new THREE.Mesh( geometry, material ); 
		obj.userData.tag = "substrate_point";
		obj.position.set(0, plane.position.y, 0);
		obj.userData.subpoint = {};
		
		obj.visible = false;	
		scene.add( obj );		
		
		arr[i] = obj;
	}		
	
	return arr;
}




function fname_s_0297(cdm)
{
	var plane = cdm.plane;
	var point = plane.userData.substrate.p;
	
	plane.geometry.computeBoundingBox();
	var pos1 = new THREE.Vector3(plane.geometry.boundingBox.min.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.min.z);
	var pos2 = new THREE.Vector3(plane.geometry.boundingBox.min.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.max.z);
	var pos3 = new THREE.Vector3(plane.geometry.boundingBox.max.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.max.z);
	var pos4 = new THREE.Vector3(plane.geometry.boundingBox.max.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.min.z);
	
	plane.updateMatrixWorld();			
	var pos1 = plane.localToWorld( pos1 );
	var pos2 = plane.localToWorld( pos2 );
	var pos3 = plane.localToWorld( pos3 );
	var pos4 = plane.localToWorld( pos4 );
	
	point[0].position.copy(pos1);
	point[1].position.copy(pos2);
	point[2].position.copy(pos3);
	point[3].position.copy(pos4);
	
	point[0].rotation.copy(plane.rotation);
	point[1].rotation.copy(plane.rotation);
	point[2].rotation.copy(plane.rotation);
	point[3].rotation.copy(plane.rotation);	
	
	
	for (var i = 0; i < point.length; i++)
	{
		var dir = new THREE.Vector3().subVectors( point[i].userData.subpoint.p2.position, point[i].position ).normalize(); 
		var qt = fname_s_0238( dir.clone() );
		
		point[i].userData.subpoint.dir = dir;
		point[i].userData.subpoint.qt = qt;
	}		
}






function fname_s_0298(cdm)
{
	if(!infProject.scene.substrate.active) return;
	 	
	var plane = infProject.scene.substrate.active;
	var point = plane.userData.substrate.p;	


	if(cdm.visible !== undefined)
	{
		var visible = cdm.visible;
	}			
	
	for (var i = 0; i < point.length; i++)
	{
		
	}
	
	plane.visible = visible;
	
	fname_s_0299({visible: visible});
	
	renderCamera();
}



function fname_s_0299(cdm)
{
	var visible = cdm.visible;
	var plane = infProject.scene.substrate.active;
	var ruler = infProject.scene.substrate.ruler;
	
	if(visible)	
	{
		if(!plane.userData.substrate.img) { visible = false; }	
	}
	
	ruler[0].visible = visible;
	ruler[1].visible = visible;
	ruler[0].userData.subtool.line.visible = visible;	
}




function fname_s_0300(cdm)
{
	if(!cdm) return;

	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	var value = fname_s_0245({ value: cdm.value, unit: 1 });
	 
	if(!value) 
	{
		$('[nameId="rp_height_plane"]').val( plane.position.y );
		
		return;
	}	
	
	plane.position.y = value.num;	

	$('[nameId="rp_height_plane"]').val( value.num );
	
	var ruler = infProject.scene.substrate.ruler;
	ruler[0].position.y = plane.position.y + 0.01;
	ruler[1].position.y = plane.position.y + 0.01;

	fname_s_0292({ruler: ruler});
	fname_s_0297({plane: plane});
	
	renderCamera();	
}




function fname_s_0301(cdm)
{
	
	
	var obj = cdm.obj;
	var img = cdm.img;
	
	if(cdm.pos)
	{
		obj.position.x = cdm.pos.x;
		obj.position.z = cdm.pos.z;
	}
	
	new THREE.TextureLoader().load(infProject.path+'/'+img, function ( image )  
	{
		var material = obj.material;
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		var ratioImg = texture.image.width/texture.image.height;
		
		if(cdm.scale)
		{
			fname_s_0310({obj: obj, size: {x: cdm.scale/2 * ratioImg, z: cdm.scale/2}});
		}
		else
		{
			fname_s_0310({obj: obj, size: {x: ratioImg * 2.5, z: 2.5}});
		}		
				
		var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
		
		var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));		
		
		fname_s_0297({plane: obj});
		
		fname_s_0225( obj );		
		
		texture.repeat.x = 1/x; 
		texture.repeat.y = -1/z;			
		
		texture.offset.x += 0.5;
		texture.offset.y += 0.5;

		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});			
}



function fname_s_0302(cdm)
{
	
	
	var image = new Image();
	image.src = cdm.image;
	
	var obj = infProject.scene.substrate.floor[0].plane;	
	if(!obj) return;
	
	infProject.scene.substrate.active = obj;
	
	image.onload = function() 
	{
		obj.userData.substrate.img = true;
		var material = obj.material;
		var texture = new THREE.Texture();
		texture.image = image;
		
		material.color = new THREE.Color( 0xffffff );
					
		texture.wrapS = THREE.MirroredRepeat;
		texture.wrapT = THREE.MirroredRepeat;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();		
		
		var ratioImg = texture.image.width/texture.image.height;

		fname_s_0310({obj: obj, size: {x: ratioImg * 2.5, z: 2.5}});
		
		var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
		
		var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));		
				
		
		if(camera == cameraTop)
		{
			fname_s_0293();			
		}

		fname_s_0297({plane: obj});	
		
		fname_s_0225( obj );
		
		texture.repeat.x = 1/x; 
		texture.repeat.y = -1/z;			
		
		texture.offset.x += 0.5;
		texture.offset.y += 0.5;		
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		fname_s_0313({value: 100});
		
		fname_s_0298({visible: true});
		
		renderCamera();
	};
		
}



function fname_s_0225( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {			
			return Math.abs(faces[i].normal[a]) - Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true; 
}





function fname_s_0304(cdm)
{	
	var intersect = cdm.intersect;
	var obj = clickO.move = cdm.intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	
	
	planeMath.position.copy( intersect.point );  
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0305( event ) 
{	
	var intersects = fname_s_0230( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );


	
	if(1==1)
	{
		fname_s_0292({ruler: infProject.scene.substrate.ruler});	
	}
}




function fname_s_0306(cdm)
{	
	var intersect = cdm.intersect;
	var obj = clickO.move = cdm.intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	
	
	planeMath.position.copy( intersect.point );  
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0307( event ) 
{	
	var intersects = fname_s_0230( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );


	
	if(1==1)
	{
		for (var i = 0; i < obj.userData.substrate.p.length; i++)
		{
			obj.userData.substrate.p[i].position.add( pos2 );
		}

		infProject.scene.substrate.ruler[0].position.add( pos2 );
		infProject.scene.substrate.ruler[1].position.add( pos2 );
		infProject.scene.substrate.ruler[0].userData.subtool.line.position.add( pos2 );		
	}
}





function fname_s_0308(cdm)
{	
	var intersect = cdm.intersect;
	var obj = clickO.move = cdm.intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );

	planeMath.position.copy( intersect.point );  
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0309( event ) 
{	
	var intersects = fname_s_0230( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	
	if(1==1)
	{
		var ps = obj.userData.subpoint.p2.position;
		var dir = obj.userData.subpoint.dir;
		var qt = obj.userData.subpoint.qt;  
		
		var v1 = fname_s_0236( new THREE.Vector3().subVectors( ps, pos ), qt ); 
		if(v1.z < 0.5) { v1.z = 0.5; }   
		var v1 = new THREE.Vector3().addScaledVector( dir, -v1.z );
		pos = new THREE.Vector3().addVectors( ps, v1 );		
	}
	
	
	if(1 == 1)
	{
		obj.updateMatrixWorld();
		var posLoc = obj.worldToLocal( pos.clone() );	
		var posX = obj.localToWorld( new THREE.Vector3(posLoc.x, 0, 0) );
		var posX = new THREE.Vector3().subVectors( posX, obj.position );
		
		var posZ = obj.localToWorld( new THREE.Vector3(0, 0, posLoc.z) );
		var posZ = new THREE.Vector3().subVectors( posZ, obj.position );	

		obj.userData.subpoint.x.position.add( posX );
		obj.userData.subpoint.z.position.add( posZ );
	}		
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );

	
	
	if(1 == 1)
	{
		var plane = obj.userData.subpoint.plane;		
		var point = plane.userData.substrate.p;
		
		plane.updateMatrixWorld();			
		var ps1 = plane.worldToLocal( point[0].position.clone() );
		var ps2 = plane.worldToLocal( point[1].position.clone() );
		var ps3 = plane.worldToLocal( point[2].position.clone() );
		var ps4 = plane.worldToLocal( point[3].position.clone() );
		
		var x = new THREE.Vector3().subVectors( ps3, ps1 ).x;
		var z = new THREE.Vector3().subVectors( ps2, ps1 ).z;
		
		fname_s_0310({obj: plane, size: {x: x/2, z: z/2}});
		
		plane.position.add( pos2.clone().divideScalar( 2 ) );
	}
}






function fname_s_0310(cdm)
{
	var obj = cdm.obj; 
	var size = cdm.size;
	
	var v = obj.geometry.vertices; 		
	v[0].x = v[1].x = v[6].x = v[7].x = -size.x;
	v[3].x = v[2].x = v[5].x = v[4].x = size.x;

	v[0].y = v[3].y = v[4].y = v[7].y = -0.0025;
	v[1].y = v[2].y = v[5].y = v[6].y = 0.0025;
	
	v[0].z = v[1].z = v[2].z = v[3].z = size.z;
	v[4].z = v[5].z = v[6].z = v[7].z = -size.z;		

	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;

	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();
}





function fname_s_0311()
{
	var size = $('[nameId="input_size_substrate"]').val();
	var value = fname_s_0245({ value: size, unit: 1, abs: true, limit: {min: 0.01, max: 1000} });
	
	if(!value) 
	{
		$('[nameid="input_size_substrate"]').val(1);
		
		return;
	}	
	
	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	var ruler = infProject.scene.substrate.ruler;	
	var dist = ruler[0].position.distanceTo( ruler[1].position );
	var ratio = value.num/dist;  
	
	
	
	plane.geometry.computeBoundingBox();	
	var x = (Math.abs(plane.geometry.boundingBox.max.x) + Math.abs(plane.geometry.boundingBox.min.x));
	var z = (Math.abs(plane.geometry.boundingBox.max.z) + Math.abs(plane.geometry.boundingBox.min.z));

	x /= 2;
	z /= 2;
	
	fname_s_0310({obj: plane, size: {x: x*ratio, z: z*ratio}});
		
	
	if(1==1)
	{	
		var v1 = plane.worldToLocal( ruler[0].position.clone() );
		var v2 = plane.worldToLocal( ruler[1].position.clone() );		
		
		var v1 = new THREE.Vector3().addScaledVector( v1, ratio );
		var v2 = new THREE.Vector3().addScaledVector( v2, ratio );
		
		var v1 = plane.localToWorld( v1.clone() ); 
		var v2 = plane.localToWorld( v2.clone() ); 
		
		ruler[0].position.x = v1.x;
		ruler[0].position.z = v1.z; 	
		ruler[1].position.x = v2.x;
		ruler[1].position.z = v2.z;	

		fname_s_0292({ruler: ruler});
	}
	
	$('[nameId="input_size_substrate"]').val( value.num );
	
	fname_s_0297({plane: plane});
	
	renderCamera();
}




function fname_s_0312(cdm)
{
	if(!cdm) return;

	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	var value = fname_s_0245({ value: cdm.angle, unit: 1 });
	 
	if(!value) 
	{
		var rot = Math.abs(Math.round( THREE.Math.radToDeg(plane.rotation.y) ));
		$('[nameId="input_rotate_substrate"]').val( rot );
		
		return;
	}	
	
	if(cdm.set)
	{
		plane.rotation.y = THREE.Math.degToRad(value.num * -1);
	}
	else
	{
		plane.rotation.y -= THREE.Math.degToRad(value.num);
	}	
	
	
	var rot = Math.abs(Math.round( THREE.Math.radToDeg(plane.rotation.y) ));

	$('[nameId="input_rotate_substrate"]').val( rot );
	
	fname_s_0297({plane: plane});
	
	renderCamera();
}





function fname_s_0313(cdm)
{
	var value = cdm.value;
	
	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	plane.material.opacity = value/100;
	plane.material.needsUpdate = true; 					
	
	$('[nameId="input_transparency_substrate"]').val(value);
	
	renderCamera();	
}




function fname_s_0314(cdm)
{
	if(!cdm) cdm = {}; 
	
	
	var plane = infProject.scene.substrate.active;	
	if(!plane) return;		
	
	fname_s_0298({visible: false});	
	
	
	plane.userData.substrate.img = false;
	
	$('#substrate_img').attr('src', 'img/f0.png');
	$('[nameid="input_size_substrate"]').val(1);
}








function fname_s_0315()
{
	$.ajax
	({
		url: infProject.path+'auto_building/room2.json',
		type: 'POST',
		dataType: 'json',
		success: function(json)
		{ 
			fname_s_0316({json: json});
		},
	});	
}



function fname_s_0316(cdm)
{
	var rooms = cdm.json.rooms;
	var middle_wall = cdm.json.middle_wall;
	
	var arr = [];
	var point = [];
	
	var id = 1;
	
	for( var i = 0; i < rooms.length; i++ )
	{
		var w = rooms[i].walls;
		arr[i] = {w: []};
		var p = [];
		
		for( var i2 = 0; i2 < w.length; i2++ )
		{
			var x = w[i2].inner_part.point_1.x/100 * 3;
			var z = w[i2].inner_part.point_1.y/100 * 3;
			var pos = new THREE.Vector3(x, 0, z);
			
			var copy = null;
			
			for( var i3 = 0; i3 < point.length; i3++ )
			{
				if(fname_s_021(pos, point[i3].pos, {kof: 0.1}))
				{
					copy = point[i3];
					break;
				}						
			}
			
			if(copy)
			{
				p[i2] = copy;
			}
			else
			{
				var n = point.length;
				point[n] = {id: id, pos: pos}; id++;
				
				p[i2] = point[n];
			}
			
		}
		
		for( var i2 = 1; i2 < p.length; i2++ )
		{
			arr[i].w[i2 - 1] = null;
			
			if(p[i2 - 1] != p[i2])
			{
				arr[i].w[i2 - 1] = {};
				arr[i].w[i2 - 1].p = [p[i2 - 1], p[i2]];
			}						
		}
	}
	

	var geometry = fname_s_0216(0.2, 0.2, 0.2);
	var material = new THREE.MeshLambertMaterial( { color : 0x00ff00, transparent: true, opacity: 1, depthTest: false }); 


	for( var i = 0; i < middle_wall.length; i++ )
	{
		var x = middle_wall[i].inner_part.point_1.x/100 * 3;
		var z = middle_wall[i].inner_part.point_1.y/100 * 3;
		var pos = new THREE.Vector3(x, 0, z);
		
		var cube = new THREE.Mesh(geometry, material);
		cube.position.set(pos.x, 0.3, pos.z);
		scene.add( cube ); 					
	}
	
	
	
	
	
	
	for( var i = 0; i < arr.length; i++ )
	{
		for( var i2 = 0; i2 < arr[i].w.length; i2++ )
		{
			if(!arr[i].w[i2]) continue;
			
			var point1 = fname_s_0242( 'point', arr[i].w[i2].p[0].id );
			var point2 = fname_s_0242( 'point', arr[i].w[i2].p[1].id );	
			
			if(point1 == null) { point1 = fname_s_0226( arr[i].w[i2].p[0].pos, arr[i].w[i2].p[0].id ); }
			if(point2 == null) { point2 = fname_s_0226( arr[i].w[i2].p[1].pos, arr[i].w[i2].p[1].id ); }	

			var obj = fname_s_0227({p: [point1, point2], width: 0.01}); 
		}
	}
	
	for ( var i = 0; i < obj_point.length; i++ ) { fname_s_0122(obj_point[i]); }
	
	fname_s_044(infProject.scene.array.wall);	
	fname_s_0166();	
	
	fname_s_099();
	
	fname_s_0317();
	
	renderCamera();
}



function fname_s_0317()
{
	var floor = infProject.scene.array.floor;
	var inf = [];
	
	for ( var i = 0; i < floor.length; i++ )
	{
		for ( var i2 = 0; i2 < floor[i].userData.room.w.length; i2++ )
		{
			var wall = floor[i].userData.room.w[i2];
			var side = floor[i].userData.room.s[i2];
			
			var line = fname_s_0318({wall: wall, side: side});
			
			for ( var i3 = 0; i3 < floor.length; i3++ )
			{
				if(floor[i] == floor[i3]) continue;
				
				var cross = [];
				
				for ( var i4 = 0; i4 < floor[i3].userData.room.w.length; i4++ )
				{
					var res = fname_s_0319({dir: line, w2: floor[i3].userData.room.w[i4]});
					
					if(res) { cross[cross.length] = res; }
				}
				
				inf[inf.length] = {wall: wall, cross: []};
			}
		}
	}
	
	
	function fname_s_0318(cdm)
	{
		var wall = cdm.wall;
		var side = cdm.side;
		
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;
		
		var dir = wall.getWorldDirection(new THREE.Vector3());
		
		if(side == 1) { dir.x *= -1; dir.y *= -1; dir.z *= -1; }
		
		wall.updateMatrixWorld();
		wall.geometry.computeBoundingSphere();
		var pos = wall.localToWorld( wall.geometry.boundingSphere.center.clone() );	

		var arrowHelper = new THREE.ArrowHelper( dir, pos, 1, 0xff0000 );
		scene.add( arrowHelper );

		var line = {p1: pos, p2: pos.clone().add(dir)};
		
		return line;
	}
	
	
	
	function fname_s_0319(cdm)
	{
		var dir = cdm.dir;
		var w2 = cdm.w2;
		
		var p0 = dir.p1;
		var p1 = dir.p2;
		var p2 = w2.userData.wall.p[0].position;
		var p3 = w2.userData.wall.p[1].position;
		
		if( !fname_s_013(p0, p1, p2, p3) ) { return null; }		
		
		var pos = fname_s_0320(p0, p1, p2, p3);
		
		if(pos && 1==2)
		{ 
			var material = new THREE.MeshLambertMaterial( { color : 0x00ff00, transparent: true, opacity: 1, depthTest: false }); 
			var cube = new THREE.Mesh( fname_s_0216(0.2, 0.2, 0.2), material );
			cube.position.set(pos.x, 1, pos.z);
			scene.add( cube ); 				
		}
		
		return pos;
	}


	
	function fname_s_0320(a1, a2, b1, b2)
	{
		var t1 = fname_s_011(a1.x, a1.z, a2.x, a2.z);
		var t2 = fname_s_011(b1.x, b1.z, b2.x, b2.z);

		var point = new THREE.Vector3();
		var f1 = fname_s_012(t1[0], t1[1], t2[0], t2[1]);
		
		if(Math.abs(f1) < 0.0001){ return null; } 
		
		point.x = fname_s_012(-t1[2], t1[1], -t2[2], t2[1]) / f1;
		point.z = fname_s_012(t1[0], -t1[2], t2[0], -t2[2]) / f1;			 
		
		return point;
	}	
	
}











function fname_s_0321(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	var x1 = (cdm.x1) ? cdm.x1 : 100;
	var y1 = (cdm.y1) ? cdm.y1 : 300;
	var x2 = (cdm.x2) ? cdm.x2 : 600;
	var y2 = (cdm.y2) ? cdm.y2 : 300;	
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var line  = document.createElementNS(infProject.settings.svg.tag, "line");

		line.setAttribute("x1", x1);
		line.setAttribute("y1", y1);

		line.setAttribute("x2", x2);
		line.setAttribute("y2", y2);
		line.setAttribute("stroke-width", "2px");
		
		if(cdm.dasharray)
		{
			line.setAttribute("stroke-dasharray", "20 10");
		}		
		
		if(cdm.color){ line.setAttribute("stroke", cdm.color); }
		else { line.setAttribute("stroke", "rgb(255, 162, 23)"); }	
		
		line.setAttribute("display", "none");
		
		line.userData = {};
		line.userData.svg = {};
		line.userData.svg.line = {};
		line.userData.svg.line.p = [new THREE.Vector3(), new THREE.Vector3()];
		line.userData.svg.show = false;		
		
		svg.appendChild(line);
		
		infProject.svg.arr[infProject.svg.arr.length] = line;
		arr[arr.length] = line;
	}
	
	return arr;
}



function fname_s_0322(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var circle = document.createElementNS(infProject.settings.svg.tag, "circle");

		circle.setAttribute("cx", 600);
		circle.setAttribute("cy", 600);

		circle.setAttribute("r", 4.2);
		circle.setAttribute("stroke-width", "2px");
		
		if(cdm.color){ circle.setAttribute("stroke", cdm.color); }
		else { circle.setAttribute("stroke", "rgb(255, 162, 23)"); }	
		
		circle.setAttribute("fill", "#fff");
		
		
		circle.setAttribute("display", "none");
		
		circle.userData = {};
		circle.userData.svg = {};
		circle.userData.svg.circle = {};
		
		circle.userData.svg.circle.pos = new THREE.Vector3();
		circle.userData.svg.show = false;		

		svg.appendChild(circle);
		
		infProject.svg.arr[infProject.svg.arr.length] = circle;
		arr[arr.length] = circle;		
	}
	
	return arr;		
}




function fname_s_0323(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var el  = document.createElementNS(infProject.settings.svg.tag, "path");

		el.setAttribute("d", 'M100 100, 300 100, 300 600, 200 600');
		el.setAttribute("stroke-width", "2px");		
		el.setAttribute("fill", "none");
		
		if(cdm.dasharray)
		{
			el.setAttribute("stroke-dasharray", "20 10");
		}		
		
		if(cdm.color){ el.setAttribute("stroke", cdm.color); }
		else { el.setAttribute("stroke", "rgb(255, 162, 23)"); }	
		
		el.setAttribute("display", "none");
		
		el.userData = {};
		el.userData.svg = {};
		el.userData.svg.path = {};
		el.userData.svg.path.arrP = [];
		el.userData.svg.show = false;		
		el.userData.svg.path.arrS = [];
		
		svg.appendChild(el);
		
		infProject.svg.arr[infProject.svg.arr.length] = el;
		arr[arr.length] = el;
	}
	
	return arr;
}




function fname_s_0324(cdm)
{
	var el = cdm.el;
	
	if(cdm.point)
	{
		el.userData.svg.line.p = cdm.point;
	}
	
	var p = el.userData.svg.line.p;
	
	
	var tempV = p[0].clone().project(camera);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	el.setAttribute("x1", x);
	el.setAttribute("y1", y);
	
	var tempV = p[1].clone().project(camera);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	el.setAttribute("x2", x);
	el.setAttribute("y2", y);		
	
}




function fname_s_0325(cdm)
{
	var el = cdm.el;
	
	if(cdm.pos)
	{
		el.userData.svg.circle.pos = cdm.pos;
	}
	
	var pos = el.userData.svg.circle.pos;
	
	var tempV = pos.clone().project(camera);
	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	el.setAttribute("cx", x);
	el.setAttribute("cy", y);			
}




function fname_s_0326(cdm)
{
	var el = cdm.el;
	
	if(cdm.arrP)
	{
		el.userData.svg.path.arrP = cdm.arrP;
	}
	
	var path = 'M';
	var arrP = el.userData.svg.path.arrP;
	var arrS = [];
	
	if(arrP.length == 0) return;
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var tempV = arrP[i].clone().project(camera);
		var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
		var y = (tempV.y * -.5 + .5) * canvas.clientHeight;
		
		path += x+' '+y+',';
		
		arrS[arrS.length] = new THREE.Vector2(x, y);
	}
	
	el.userData.svg.path.arrS = arrS;

	el.setAttribute("d", path);			
}






function fname_s_0327(cdm)
{
	var el = cdm.el;
	
	for ( var i = 0; i < el.length; i++ )
	{
		var x = ( ( el[i].x1.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( el[i].y1.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var A = new THREE.Vector3(x, y, -1);
		A.unproject(camera);
		
		var x = ( ( el[i].x2.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( el[i].y2.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var B = new THREE.Vector3(x, y, -1);
		B.unproject(camera);					
		
		el[i].userData.svg.line.p = [A, B];
	}				
}







function fname_s_0328(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].setAttribute("display", "block");
	}	
}



function fname_s_0329(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].setAttribute("display", "none");
	}	
}







function fname_s_0330(cdm)
{
	var el = cdm.el;
	
	for ( var i = 0; i < el.length; i++ )
	{
		
		el[i].addEventListener('mouseover', 		
			function() 
			{ 
				this.setAttribute("r", 6);				
			}
		);
		
		el[i].addEventListener('mouseout', 		
			function() 
			{ 
				this.setAttribute("r", 4.2);
			}
		);
		
		el[i].addEventListener('mousedown', 		
			function(event) 
			{ 
				fname_s_067({event: event, elem: this});
				event.stopPropagation();
			}
		);			
	}
 
}




















function fname_s_0331(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].style.display = 'block'; 
		arr[i].userData.elem.show = true;		
	}	
}



function fname_s_0332(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].style.display = 'none'; 
		arr[i].userData.elem.show = false; 
	}	
}





function fname_s_0333(cdm)
{
	var arr = [];
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var labelContainerElem = document.querySelector('#htmlBlock');
		var elem = document.createElement('div');
		elem.textContent = '';
		elem.style.cssText = 'position: absolute; text-align: center;';
		elem.style.cssText += infProject.settings.html.fonts.wall.size; 
		elem.style.cssText += infProject.settings.html.fonts.wall.type;
		elem.style.cssText += infProject.settings.html.fonts.wall.color;
		elem.style.cssText += 'z-index: 1;';
		if(cdm.style) { elem.style.cssText += (cdm.style); }
		
		labelContainerElem.appendChild(elem); 
		
		elem.userData = {};
		elem.userData.tag = cdm.tag;
		elem.userData.elem = {};
		elem.userData.elem.pos = new THREE.Vector3();
		elem.userData.elem.show = true;
		
		infProject.html.label[infProject.html.label.length] = elem;	

		arr[arr.length] = elem;
		
		if(cdm.display)
		{
			elem.style.display = cdm.display;
			elem.userData.elem.show = false;
		}
	}
	
	return arr;
}
























function fname_s_0334(e)
{
    var posx = 0;
    var posy = 0;
    if (e.pageX || e.pageY)     
	{
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)    
	{
        posx = e.clientX + containerF.scrollLeft + containerF.documentElement.scrollLeft;
        posy = e.clientY + containerF.scrollTop + containerF.documentElement.scrollTop;
    }

    return {x: posx, y : posy};
}


function fname_s_0335(event) 
{ 
	if(camera == cameraTop && clickO.keys[16]){} 
	else { return false; }

	clickO.rayhit = null;
	fname_s_079();
	
	infProject.tools.selectionBox.msdown = true;
	infProject.tools.selectionBox.fname_s_0334 = fname_s_0334(event);

	infProject.tools.selectionBox.mStart.x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	infProject.tools.selectionBox.mStart.y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
	
	return true;
}
 
function fname_s_0336(event)
{
	if(camera == cameraTop && clickO.keys[16] && infProject.tools.selectionBox.msdown){}
	else { return false; }
	
	var x1=0;
	var x2=0;
	var y1=0;
	var y2=0;
	var mousexy = fname_s_0334(event);  
	x1 = infProject.tools.selectionBox.fname_s_0334.x;
	y1 = infProject.tools.selectionBox.fname_s_0334.y;
	x2 = mousexy.x;
	y2 = mousexy.y;
	if (x1==x2){return;}
	if (y1==y2){return;}
	if (x1>x2){
		x1 = x1+x2;
		x2 = x1-x2;
		x1 = x1-x2;
	}
	if (y1>y2){
		y1 = y1+y2;
		y2 = y1-y2;
		y1 = y1-y2;
	}
	var sframe = document.getElementById('selectBoxFrame'); 
	sframe.style.top = y1+'px';
	sframe.style.left = x1+'px';
	sframe.style.width = x2-x1+'px';
	sframe.style.height = y2-y1+'px'; 
	sframe.style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden';		
	
	return true;
}



function fname_s_0337(event)
{ 
	if(camera == cameraTop && clickO.keys[16] && infProject.tools.selectionBox.msdown){}
	else { return false; }
	
	infProject.tools.selectionBox.msdown = false; 
	document.getElementById('selectBoxFrame').style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden';

	infProject.tools.selectionBox.mEnd.x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	infProject.tools.selectionBox.mEnd.y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	

	fname_s_0339();
	
	
	renderCamera();
	
	return true;
}


function fname_s_0338() 
{  
	infProject.tools.selectionBox.msdown = false; 
	document.getElementById('selectBoxFrame').style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden'; 
}	






function fname_s_0339()
{
	var pos1 = new THREE.Vector3( infProject.tools.selectionBox.mStart.x, infProject.tools.selectionBox.mStart.y, -1 ).unproject( camera ); 	
	var pos2 = new THREE.Vector3( infProject.tools.selectionBox.mEnd.x, infProject.tools.selectionBox.mEnd.y, -1 ).unproject( camera ); 		
	
	var bound = { min : {x:0,z:0}, max : {x:0,z:0} };
	
	if(pos1.x < pos2.x) { bound.min.x = pos1.x; bound.max.x = pos2.x; }
	else { bound.min.x = pos2.x; bound.max.x = pos1.x; }
	
	if(pos1.z < pos2.z) { bound.min.z = pos1.z; bound.max.z = pos2.z; }
	else { bound.min.z = pos2.z; bound.max.z = pos1.z; }


	
	clickO.obj = null;
	
	var arr = [];
	
	
	for(var i = 0; i < infProject.scene.array.obj.length; i++)
	{
		var obj = infProject.scene.array.obj[i];

		if(bound.min.x < obj.position.x && bound.max.x > obj.position.x)
		{
			if(bound.min.z < obj.position.z && bound.max.z > obj.position.z)
			{
				arr[arr.length] = obj;
			}
		}
	}	
	
	clickO.selectBox.arr = arr;
	
	fname_s_0207({arr: arr});	
}




function fname_s_0340( intersect )
{
	var arr = clickO.selectBox.arr;
	
	if(arr.length > 0) {}
	else { return false; }
	
	planeMath.position.set( 0, intersect.point.y, 0 );	
	planeMath.rotation.set(-Math.PI/2, 0, 0);

	var obj = intersect.object;	 
	clickO.pos.clickDown = intersect.point.clone();		

	
	
	var flag = false;
	
	for ( var i = 0; i < arr.length; i++ )
	{
		if(obj == arr[i]) 
		{ 
			flag = true; 
			clickO.selectBox.drag = true;
			clickO.selectBox.move = false;
			break; 
		}	
	}
	
	fname_s_0207({arr: arr});
	
	return flag;
}





function fname_s_0341(event) 
{
	if(!clickO.selectBox.move) 
	{
		clickO.selectBox.move = true;
	}	
	
	var intersect = fname_s_0230( event, planeMath, 'one' );
	var pos2 = new THREE.Vector3().subVectors( intersect[0].point, clickO.pos.clickDown );		
	
	
	for ( var i = 0; i < clickO.selectBox.arr.length; i++ ){ clickO.selectBox.arr[i].position.add(pos2); }	
	
	
	clickO.pos.clickDown = intersect[0].point.clone();
}
 



function fname_s_0342(cdm) 
{
	clickO.selectBox.drag = false;
	
	if(!clickO.selectBox.move) return;	
		
	clickO.selectBox.move = false;	
}





function fname_s_0343(obj)  
{
	var arr = clickO.selectBox.arr;
	
	if(arr.length > 0) {}
	else { return false; }
	
	if(obj)
	{
		for ( var i = 0; i < arr.length; i++ )
		{
			if(obj == arr[i]) { return true; }	
		}		
	}
	 

	fname_s_0208();
	clickO.selectBox.arr = [];
	
	return false;
}











 

function fname_s_0344( o, ur )
{
	
	if(ur == 'down')
	{
		if(infProject.ur.back.length - 1 > infProject.ur.count)
		{
			var d = infProject.ur.back.length - (infProject.ur.count + 1);  
			infProject.ur.back.splice(infProject.ur.count + 1, d);  		
		}		
		
		infProject.ur.count += 1; 
		infProject.ur.back[infProject.ur.count] = o; 
		
	}
	else if(ur == 'up')
	{ 
		infProject.ur.forward[infProject.ur.count] = o;
		
	}		
}




function fname_s_0345(cdm)
{
	var obj = cdm.obj;
	
	var ar = { cdm : 'objPop_move' };

	ar.id = obj.userData.id;
	ar.pos = obj.userData.obj3D.ur.pos.clone();
	ar.q = obj.userData.obj3D.ur.q.clone();
	
	fname_s_0344( ar, 'down' );
	
	
	var ar = { cdm : 'objPop_move' };
	
	ar.id = obj.userData.id;
	ar.pos = obj.position.clone();
	ar.q = obj.quaternion.clone(); 

	fname_s_0344( ar, 'up' );
}




function fname_s_0346(cdm)
{
	var obj = cdm.obj;
	
	var ar = { cdm : 'objPop_delete' };

	ar.id = obj.userData.id;
	ar.lotid = obj.userData.obj3D.lotid;
	ar.pos = obj.position.clone();
	ar.q = obj.quaternion.clone(); 	

	
	fname_s_0344( ar, 'down' );
	
	
	var ar = { cdm : 'objPop_delete' };	
	ar.id = obj.userData.id; 

	fname_s_0344( ar, 'up' );
}




function fname_s_0347(cdm)
{
	var obj = cdm.obj;
	
	var ar = { cdm : 'add_objPop' };
	
	ar.id = obj.userData.id;

	fname_s_0344( ar, 'down' );
	
	
	
	var ar = { cdm : 'add_objPop' };

	ar.id = obj.userData.id;
	ar.lotid = obj.userData.obj3D.lotid;
	ar.pos = obj.userData.obj3D.ur.pos.clone();
	ar.q = obj.userData.obj3D.ur.q.clone(); 
	
	fname_s_0344( ar, 'up' );
}







function fname_s_0348( cdm )
{		  
	var n = (cdm == 'redo') ? infProject.ur.count + 1 : infProject.ur.count;	
	
	if(n < 0 | n > (infProject.ur.back.length - 1)){ return; }
	
	infProject.ur.count = n; 
	
	fname_s_0234();
	
	
	if(infProject.ur.back[n].cdm == 'objPop_move'){ fname_s_0349(cdm); }
	else if(infProject.ur.back[n].cdm == 'objPop_delete'){ fname_s_0350(cdm); }
	else if(infProject.ur.back[n].cdm == 'add_objPop'){ fname_s_0351(cdm); }
	
		
	if(cdm == 'undo') {  }			
	else if(cdm == 'redo') {  }		
	
	if(cdm == 'undo'){ infProject.ur.count -= 1; }		
}





function fname_s_0349(cdm)
{
	var n = infProject.ur.count;
	
	if(cdm == 'undo') { var ar = infProject.ur.back[n]; }			
	else if(cdm == 'redo') { var ar = infProject.ur.forward[n]; }		
	
	var obj = fname_s_0242( 'obj', ar.id ); 		
	
	obj.userData.obj3D.ur.pos = ar.pos;
	obj.userData.obj3D.ur.q = ar.q;
	
	obj.position.copy(ar.pos);
	obj.quaternion.copy(ar.q);
	
	renderCamera();
}




function fname_s_0350(cdm)
{
	var n = infProject.ur.count;
	
	if(cdm == 'undo') { var ar = infProject.ur.back[n]; }				
	else if(cdm == 'redo') { var ar = infProject.ur.forward[n]; }		
	
	
	if(cdm == 'undo')	
	{ 		
		fname_s_0274({id: ar.id, lotid: ar.lotid, pos: ar.pos, q: ar.q});
	}
	else if(cdm == 'redo')	
	{ 
		fname_s_0260({obj: fname_s_0242( 'obj', ar.id ), undoRedo: false});
	}	
	
	renderCamera();
}




function fname_s_0351(cdm)
{
	var n = infProject.ur.count;
	
	if(cdm == 'undo') { var ar = infProject.ur.back[n]; }				
	else if(cdm == 'redo') { var ar = infProject.ur.forward[n]; }		
	
	
	if(cdm == 'undo')	
	{ 				
		fname_s_0260({obj: fname_s_0242( 'obj', ar.id ), undoRedo: false});
	}
	else if(cdm == 'redo')	
	{ 
		fname_s_0274({id: ar.id, lotid: ar.lotid, pos: ar.pos, q: ar.q});
	}
	
	renderCamera();
}







