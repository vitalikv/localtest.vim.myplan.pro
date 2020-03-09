

function coords(e)
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


function selectionBoxDown(event) 
{ 
	if(camera == cameraTop && clickO.keys[16]){} 
	else { return false; }
	 	
	infProject.tools.selectionBox.msdown = true;
	infProject.tools.selectionBox.coords = coords(event);

	infProject.tools.selectionBox.mStart.x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	infProject.tools.selectionBox.mStart.y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
	
	return true;
}
 
function selectionBoxMove(event)
{
	if(camera == cameraTop && clickO.keys[16] && infProject.tools.selectionBox.msdown){}
	else { return false; }
	
	var x1=0;
	var x2=0;
	var y1=0;
	var y2=0;
	var mousexy = coords(event);  
	x1 = infProject.tools.selectionBox.coords.x;
	y1 = infProject.tools.selectionBox.coords.y;
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
	var sframe = document.getElementById('canvasFrame'); 
	sframe.style.top = y1+'px';
	sframe.style.left = x1+'px';
	sframe.style.width = x2-x1+'px';
	sframe.style.height = y2-y1+'px'; 
	sframe.style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden';		
	
	return true;
}


// закончили выделение 
function selectionBoxUp(event, keyUp)
{
	if(camera == cameraTop && clickO.keys[16] && infProject.tools.selectionBox.msdown){}
	else { return false; }
	
	infProject.tools.selectionBox.msdown = false; 
	document.getElementById('canvasFrame').style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden';

	infProject.tools.selectionBox.mEnd.x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	infProject.tools.selectionBox.mEnd.y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	

	//getBoundSelectionBox();
	//objDeActiveColor_2D();
	
	renderCamera();
	
	return true;
}


function selectionBoxHide() 
{  
	infProject.tools.selectionBox.msdown = false; 
	document.getElementById('canvasFrame').style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden'; 
}	


// границы selectionBox, ищем объекты которые попали selectionBox
function getBoundSelectionBox()
{
	return;
	var pos1 = new THREE.Vector3( infProject.tools.selectionBox.mStart.x, infProject.tools.selectionBox.mStart.y, -1 ).unproject( camera ); 	
	var pos2 = new THREE.Vector3( infProject.tools.selectionBox.mEnd.x, infProject.tools.selectionBox.mEnd.y, -1 ).unproject( camera ); 		
	
	var bound = { min : {x:0,z:0}, max : {x:0,z:0} };
	
	if(pos1.x < pos2.x) { bound.min.x = pos1.x; bound.max.x = pos2.x; }
	else { bound.min.x = pos2.x; bound.max.x = pos1.x; }
	
	if(pos1.z < pos2.z) { bound.min.z = pos1.z; bound.max.z = pos2.z; }
	else { bound.min.z = pos2.z; bound.max.z = pos1.z; }


	// возращаем стандартный цвет, тем объектам которые были выделены
	//objDeActiveColor_2D_selectBox(null);
	clickO.obj = null;

	
	// стены, которые попали в выделение 
	//clickO.selectBox.walls = crossSelectionBox(bound);	
	//for ( var i = 0; i < clickO.selectBox.walls.length; i++ ){ clickO.selectBox.walls[i].material[0].color = actColorWin; }	
	
	//addPointSelectBox(); 	// получаем point/wd/соседние стены/стены соседних стен
	
	
	// объекты попавшие в область выделения
	for(var i = 0; i < infProject.scene.array.obj.length; i++)
	{
		var obj = infProject.scene.array.obj[i];

		if(bound.min.x < obj.position.x && bound.max.x > obj.position.x)
		{
			if(bound.min.z < obj.position.z && bound.max.z > obj.position.z)
			{
				//clickO.selectBox.objPop[clickO.selectBox.objPop.length] = obj;
			}
		}
	}	
	
	//outlineAddObj( clickO.selectBox.objPop );	
}



// стены, которые попали в выделенную область selectionBox 
function crossSelectionBox(bound)
{
	return;
	var cross = [];
	
	var pos = [];
	pos[0] = new THREE.Vector3(bound.min.x, 0, bound.min.z);
	pos[1] = new THREE.Vector3(bound.min.x, 0, bound.max.z);
	pos[2] = new THREE.Vector3(bound.max.x, 0, bound.min.z);
	pos[3] = new THREE.Vector3(bound.max.x, 0, bound.max.z);
	
	var line = [];
	line[0] = [pos[0], pos[1]];
	line[1] = [pos[0], pos[2]];
	line[2] = [pos[3], pos[2]];
	line[3] = [pos[3], pos[1]];
	
	
	// стены, которые пересеклись с областью выделения
	for ( var i = 0; i < line.length; i++ )
	{
		for ( var i2 = 0; i2 < obj_line.length; i2++ )
		{			
			var p2 = line[i][0];
			var p3 = line[i][1];
			var p0 = obj_line[i2].userData.wall.p[0].position;
			var p1 = obj_line[i2].userData.wall.p[1].position;

			var exist = false;
			for(var i3 = 0; i3 < cross.length; i3++)
			{
				if(cross[i3] == obj_line[i2]) { exist = true; break; }
			}
			
			if(exist) continue;		
			
			if(CrossLine(p0, p1, p2, p3)) { cross[cross.length] = obj_line[i2]; }	// стены пересеклись
		}
	}
	
	// стены, точки которых попали внутырь области выделения
	for(var i = 0; i < obj_point.length; i++)
	{				
		if(bound.min.x < obj_point[i].position.x && bound.max.x > obj_point[i].position.x)
		{
			if(bound.min.z < obj_point[i].position.z && bound.max.z > obj_point[i].position.z)
			{
				for(var i2 = 0; i2 < obj_point[i].w.length; i2++)
				{
					var exist = false;
					for(var i3 = 0; i3 < cross.length; i3++)
					{
						if(cross[i3] == obj_point[i].w[i2]) { exist = true; break; }
					}
					
					if(!exist)
					{
						cross[cross.length] = obj_point[i].w[i2];						
					}
				}
			}
		}
	}
	
	
	return cross;  // стены
}



// из массива стен, находим пренадлежащие wd и point
// также находим соседние стены, но не попали в SelectBox (нужны для расчета размеров и углов)
function addPointSelectBox()
{
	if(clickO.selectBox.walls.length == 0) return;
	
	var walls = [];		// выделенные стены
	var walls_2 = [];	// соседние стены
	var walls_3 = [];	// соседние стены, соседних стен
	
	var point = [];		// выделенные точки, которые будут перемещаться
	var point_2 = [];	// точки соседних стен, точки которые не попали в область выделения, НЕ будут перемещаться	
	
	var wd = [];		// окна/двери выделенных стен
	
	// у стен находим точки и окна/двери, повторяющиеся точки не добавляем 
	for ( var i = 0; i < clickO.selectBox.walls.length; i++ )
	{				
		var f1 = true;
		var f2 = true;
		
		for ( var i2 = 0; i2 < point.length; i2++ )
		{  
			if(point[i2] == clickO.selectBox.walls[i].userData.wall.p[0]) { f1 = false; }
			if(point[i2] == clickO.selectBox.walls[i].userData.wall.p[1]) { f2 = false; }
		}	
		
		// point
		if(f1) { point[point.length] = clickO.selectBox.walls[i].userData.wall.p[0]; }
		if(f2) { point[point.length] = clickO.selectBox.walls[i].userData.wall.p[1]; }
		
		// wd
		for ( var i2 = 0; i2 < clickO.selectBox.walls[i].userData.wall.arrO.length; i2++ )
		{ 
			wd[wd.length] = clickO.selectBox.walls[i].userData.wall.arrO[i2];
		}

		// wall
		walls[walls.length] = clickO.selectBox.walls[i];					
	}
	
		
	
	// находим соседние стены, которые не выделены selectBox
	for ( var i = 0; i < point.length; i++ )
	{		 
		for ( var i2 = 0; i2 < point[i].w.length; i2++ )
		{
			var exist = false;
			for ( var i3 = 0; i3 < walls.length; i3++ )
			{
				if(point[i].w[i2] == walls[i3]) { exist = true; break; }
			}

			if(!exist)
			{
				var exist = false;
				for ( var i3 = 0; i3 < walls_2.length; i3++ )
				{
					if(point[i].w[i2] == walls_2[i3]) { exist = true; break; }
				}
				if(!exist) { walls_2[walls_2.length] = point[i].w[i2]; }				
			}
		}
	}
	
	

	
	// точки соседних стен, точки которые не попали в область выделения, НЕ будут перемещаться
	for ( var i = 0; i < walls_2.length; i++ )
	{
		var p = walls_2[i].userData.wall.p;
		var f1 = true;
		var f2 = true;
		
		for ( var i2 = 0; i2 < point.length; i2++ )
		{
			if(p[0] == point[i2]){ f1 = false; }
			if(p[1] == point[i2]){ f2 = false; }
		}
		
		if(f1)
		{
			var exist = false;
			for ( var i3 = 0; i3 < point_2.length; i3++ ){ if(p[0] == point_2[i3]) { exist = true; break; } }
			if(!exist) { point_2[point_2.length] = p[0]; }		// если в массиве нет, то добавляем ее туда						
		}
		
		if(f2)
		{
			var exist = false;
			for ( var i3 = 0; i3 < point_2.length; i3++ ){ if(p[1] == point_2[i3]) { exist = true; break; } }
			if(!exist) { point_2[point_2.length] = p[1]; }		// если в массиве нет, то добавляем ее туда						
		}		
	}
	
	
	
	// соседние стены, соседних стен
	for ( var i = 0; i < point_2.length; i++ )
	{
		for ( var i2 = 0; i2 < point_2[i].w.length; i2++ )
		{
			var exist = false;
			for ( var i3 = 0; i3 < walls.length; i3++ ){ if(point_2[i].w[i2] == walls[i3]) { exist = true; break; } }
			if(!exist) { for ( var i3 = 0; i3 < walls_2.length; i3++ ){ if(point_2[i].w[i2] == walls_2[i3]) { exist = true; break; } } }
			
			if(!exist) 
			{
				var exist = false;
				for ( var i4 = 0; i4 < walls_3.length; i4++ ){ if(point_2[i].w[i2] == walls_3[i4]) { exist = true; break; } }
				if(!exist) { walls_3[walls_3.length] = point_2[i].w[i2]; }		// если в массиве нет, то добавляем ее туда					
			}
		}
	}
	
	
	for ( var i = 0; i < point.length; i++ ){ point[i].userData.point.last.pos = point[i].position.clone(); }

	clickO.selectBox.point = point; 		// выделенные точки, которые будут перемещаться	
	clickO.selectBox.point_2 = point_2; 	// точки соседних стен, точки которые не попали в область выделения, НЕ будут перемещаться	
	clickO.selectBox.walls_2 = walls_2;		// соседние стены соседних стен
	clickO.selectBox.walls_3 = walls_3;		// соседние стены соседних стен
	clickO.selectBox.wd = wd;				// соседние стены соседних стен
}



// кликнули, на что-то что попало в selectBox (собираем данные)
function clickWall_2D_selectBox( intersect )
{
	if(clickO.selectBox.point.length > 0) {}
	else if(clickO.selectBox.objPop.length > 0) {}
	else { return false; }
	
	planeMath.position.set( 0, intersect.point.y, 0 );	
	planeMath.rotation.set(-Math.PI/2, 0, 0);

	var obj = intersect.object;	 
	clickO.pos.clickDown = intersect.point.clone();		// позиция от которой начнется перемещение 

	
	// проверяем клинкули ли на объект из массива selectBox  
	var flag = false;
	var arr = [];
	
	if(obj.userData.tag)
	{
		if(obj.userData.tag == 'wall'){ arr = clickO.selectBox.walls; }
		else if(obj.userData.tag == 'point'){ arr = clickO.selectBox.point; }
		else if(obj.userData.tag == 'window'){ arr = clickO.selectBox.wd; }
		else if(obj.userData.tag == 'door'){ arr = clickO.selectBox.wd; }
		else if(obj.userData.tag == 'obj'){ arr = clickO.selectBox.objPop; }
	}
	
	
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
	
	return flag;
}



// перетаскиваем объекты, которые попались SelectionBox
function moveSelectionBox(event) 
{
	if(!clickO.selectBox.move) 
	{
		clickMovePoint_BSP(clickO.selectBox.walls);
		clickMovePoint_BSP(clickO.selectBox.walls_2);
		clickMovePoint_BSP(clickO.selectBox.walls_3);
		clickO.selectBox.move = true;
	}	
	
	var intersect = rayIntersect( event, planeMath, 'one' );
	var pos2 = new THREE.Vector3().subVectors( intersect[0].point, clickO.pos.clickDown );		
	
	for ( var i = 0; i < clickO.selectBox.point.length; i++ ){ clickO.selectBox.point[i].position.add(pos2); }
	for ( var i = 0; i < clickO.selectBox.objPop.length; i++ ){ clickO.selectBox.objPop[i].position.add(pos2); }
	
	for ( var i = 0; i < clickO.selectBox.walls.length; i++ ) { updateWall_2(clickO.selectBox.walls[i]); }	
	for ( var i = 0; i < clickO.selectBox.walls_2.length; i++ ) { updateWall_2(clickO.selectBox.walls_2[i]); }	
	
	
	var p1 = clickO.selectBox.point;
	var p2 = clickO.selectBox.point_2;
	
	for ( var i = 0; i < p1.length; i++ ){ upLineYY_2(p1[i], p1[i].p, p1[i].w, p1[i].start); }
	for ( var i = 0; i < p2.length; i++ ){ upLineYY_2(p2[i], p2[i].p, p2[i].w, p2[i].start); }

	upLabelPlan_1(clickO.selectBox.walls);
	upLabelPlan_1(clickO.selectBox.walls_2);
	upLabelPlan_1(clickO.selectBox.walls_3);
	
	clickO.pos.clickDown = intersect[0].point.clone();
}
 

// прекращаем перетаскивать SelectionBox
function upSelectionBox(cdm) 
{
	clickO.selectBox.drag = false;
	
	if(!clickO.selectBox.move) return;
	
	if(clickO.selectBox.walls.length > 0)
	{
		upLabelPlan_1(clickO.selectBox.walls);
		upLabelPlan_1(clickO.selectBox.walls_2);
		upLabelPlan_1(clickO.selectBox.walls_3);
		updateShapeFloor( infProject.scene.array.floor );
		clickPointUP_BSP(clickO.selectBox.walls);
		clickPointUP_BSP(clickO.selectBox.walls_2);
		clickPointUP_BSP(clickO.selectBox.walls_3);
	}
		
	clickO.selectBox.move = false;	
}



// создать группу объектов
function createGroupObj()
{
	if(clickO.selectBox.objPop.length == 0) return;
	
	var v = [];
	
	for(var i = 0; i < clickO.selectBox.objPop.length; i++)
	{
		var obj = clickO.selectBox.objPop[i];
		
		obj.updateMatrixWorld();
		obj.geometry.computeBoundingBox();	
		
		v[v.length] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.max.z) );
		v[v.length] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.max.z) );
		v[v.length] = obj.localToWorld( new THREE.Vector3(0, obj.geometry.boundingBox.min.y, 0) );
		v[v.length] = obj.localToWorld( new THREE.Vector3(0, obj.geometry.boundingBox.max.y, 0) );
		v[v.length] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.min.z) );
		v[v.length] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.min.z) );		
	}
	
	var bound = { min : { x : 999999, y : 999999, z : 999999 }, max : { x : -999999, y : -999999, z : -999999 } };
	
	for(var i = 0; i < v.length; i++)
	{
		if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
		if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
		if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
		if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }
		if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
		if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
	}
	
	
	var x = (bound.max.x - bound.min.x) / 2 + bound.min.x;
	var z = (bound.max.z - bound.min.z) / 2 + bound.min.z;
	
	var centP = new THREE.Vector3(x, bound.min.y, z);
		
	var material = new THREE.MeshLambertMaterial({ color: colWin, transparent: true, opacity: 0.0 }); 
	material.visible = false;
	var box = new THREE.Mesh( createGeometryCube(bound.max.x-bound.min.x, 0.001, bound.max.z-bound.min.z), material ); 	
	box.position.copy(centP);
	
	box.userData.id = countId; countId++;
	box.userData.tag = 'group_pop';
	box.userData.obj3D = { last : { pos : new THREE.Vector3()} };
	box.userData.obj3D.name = "новая группа";
	box.userData.obj3D.size = new THREE.Vector3(bound.max.x-bound.min.x, 0.001, bound.max.z-bound.min.z);
	scene.add( box );
	
	infProject.scene.array.group[infProject.scene.array.group.length] = box;
	
	
	for(var i = 0; i < clickO.selectBox.objPop.length; i++)
	{
		clickO.selectBox.objPop[i].userData.group = box;
		
		clickO.selectBox.objPop[i].position.copy(new THREE.Vector3().subVectors( clickO.selectBox.objPop[i].position, centP ) );
				
		box.add( clickO.selectBox.objPop[i] );
	}		
	
	
	// снимаем выделение
	objDeActiveColor_2D_selectBox(null);
	
	setPivotOnPopObj( box );

	drawRender();
}


// создаем пустую группы из сохраненного файла
function createGroupObjXML(groups)
{
	var arr = groups;
	
	var material = new THREE.MeshLambertMaterial({ color: colWin, transparent: true, opacity: 0.3 }); 
	material.visible = false;
	
	for(var i = 0; i < arr.length; i++)
	{		
		var box = new THREE.Mesh( createGeometryCube(arr[i].size.x, arr[i].size.y, arr[i].size.z), material ); 	
		box.position.set(arr[i].position.x, arr[i].position.y, -arr[i].position.z);
		box.rotation.y = THREE.Math.degToRad(-arr[i].rotationEuler.y);
		
		box.userData.id = arr[i].id;		
		box.userData.tag = 'group_pop';
		box.userData.obj3D = { last : { pos : new THREE.Vector3()} };
		box.userData.obj3D.name = arr[i].name;
		box.userData.obj3D.size = new THREE.Vector3(arr[i].size.x, arr[i].size.y, arr[i].size.z);
		scene.add( box );

		infProject.scene.array.group[infProject.scene.array.group.length] = box;
	}
}


// разбить группу объектов
function dropGroupObj()
{  
	if(!clickO.last_obj) return; 
	if(clickO.last_obj.userData.tag != 'group_pop') return;
	
	var box = clickO.last_obj;
	
	for(var i = box.children.length - 1; i > -1; i--)
	{
		var child = box.children[i];
		
		var pos = child.getWorldPosition(new THREE.Vector3());
		var qt = child.getWorldQuaternion(new THREE.Quaternion());
		
		child.userData.group = null;
		scene.add(child);
		
		child.position.copy(pos);
		child.quaternion.copy(qt);
	}
	
	hidePivotGizmo_2();
	
	clickO.last_obj = null;
	clickO.obj = null;
	obj_selected = null;
	
	scene.remove( box );
	
	drawRender();
}




