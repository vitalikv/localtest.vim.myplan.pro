



// активируем 3D объект или разъем, ставим pivot/gizmo
function clickObject3D(cdm)
{
	var obj = cdm.obj;
	var rayhit = cdm.rayhit;
	
	obj.updateMatrixWorld();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			 
	
	
	// Quaternion
	if(1==2)	// глобальный gizmo
	{
		var qt = new THREE.Quaternion();
	}
	else		// локальный gizmo, относительно centerObj
	{					
		var qt = obj.quaternion.clone();	 		
	}		
	
 
	// объект уже выбран
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
		pivot.userData.pivot.axs.y.visible = false;
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
	
	setScalePivotGizmo();
	
	if(camera == cameraTop) { outlineRemoveObj(); }
	if(camera == camera3D) { outlineAddObj({arr: [obj]}); }
	
	activeObjRightPanelUI_1({obj: obj});	// показываем меню UI

	showSvgSizeObj({obj: obj});
}



// показываем размеры объекта
function showSvgSizeObj(cdm)
{
	if(camera != cameraTop) return;
	
	var obj = cdm.obj;
		
	
	
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingBox();	
	//obj.geometry.computeBoundingSphere()
		
	
	
	// размеры объекта
	{
		var sizeX = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var sizeZ = obj.geometry.boundingBox.max.z - obj.geometry.boundingBox.min.z;
		
		
		var x1 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.max.z - 0.06) );
		var x2 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.max.z - 0.06) );
		var z1 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x + 0.06, 0, obj.geometry.boundingBox.min.z) );
		var z2 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x + 0.06, 0, obj.geometry.boundingBox.max.z) );
		
		updateSvgLine({el: infProject.svg.furn.size[0], point: [x1, x2]});
		updateSvgLine({el: infProject.svg.furn.size[1], point: [z1, z2]});
		showElementSvg(infProject.svg.furn.size);

		var html = infProject.html.furn.size;
		
		showElementHtml(html);
		
		var posLabel = new THREE.Vector3().subVectors( x2, x1 ).divideScalar( 2 ).add(x1); 
		html[0].userData.elem.pos = posLabel;	
		html[0].style.transform = 'translate(-50%, -50%)';
		html[0].textContent = Math.round(sizeX * 100) / 100 + '';		
		upPosLabels_2({elem: html[0]});

		var posLabel = new THREE.Vector3().subVectors( z2, z1 ).divideScalar( 2 ).add(z1); 
		html[1].userData.elem.pos = posLabel;	
		html[1].style.transform = 'translate(-50%, -50%)';
		html[1].textContent = Math.round(sizeZ * 100) / 100 + '';		
		upPosLabels_2({elem: html[1]});		
	}
	
	
	// box1 
	{
		var v = [];
		v[0] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.max.z) );	// bottom-left
		v[1] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.max.z) );	// bottom-right
		v[2] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.min.z) );	// top-left
		v[3] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.min.z) );	// top-right	
		
		var box1 = infProject.svg.furn.box1;
		
		updateSvgPath({el: box1, arrP: [v[0], v[1], v[3], v[2], v[0]]});
		showElementSvg([box1]);
		
		
		var circle = infProject.svg.furn.boxCircle;
		
		// circle[0] top-left
		// circle[1] top-center
		// circle[2] top-right
		
		// circle[3] bottom-left
		// circle[4] bottom-center
		// circle[5] bottom-right		
		
		// circle[6] left-center
		// circle[7] right-center		
		
		// top
		updateSvgCircle({el: circle[0], pos: v[2]});
		updateSvgCircle({el: circle[1], pos: new THREE.Vector3().subVectors( v[3], v[2] ).divideScalar( 2 ).add(v[2])});
		updateSvgCircle({el: circle[2], pos: v[3]});
		
		// bottom
		updateSvgCircle({el: circle[3], pos: v[0]});
		updateSvgCircle({el: circle[4], pos: new THREE.Vector3().subVectors( v[1], v[0] ).divideScalar( 2 ).add(v[0])});
		updateSvgCircle({el: circle[5], pos: v[1]});		
		
		// left	center
		updateSvgCircle({el: circle[6], pos: new THREE.Vector3().subVectors( v[2], v[0] ).divideScalar( 2 ).add(v[0])});
		
		// right center
		updateSvgCircle({el: circle[7], pos: new THREE.Vector3().subVectors( v[3], v[1] ).divideScalar( 2 ).add(v[1])});
		
		showElementSvg(circle);		
	}


	
	// box2 
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
		
		var p1 = new THREE.Vector3(bound.min.x, 0, bound.min.z);	// top-left
		var p2 = new THREE.Vector3(bound.max.x, 0, bound.min.z);	// top-right		
		var p3 = new THREE.Vector3(bound.max.x, 0, bound.max.z);	// bottom-right				
		var p4 = new THREE.Vector3(bound.min.x, 0, bound.max.z);	// bottom-left		
		
		
		updateSvgPath({el: box2, arrP: [p1, p2, p3, p4, p1]});
		showElementSvg([box2]);		
	}
	
	
	// определяем к какой комнате относится объект и показываем расстояние до стен
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
			var p1 = new THREE.Vector3(bound.min.x, 0, bound.min.z);	// top-left
			var p2 = new THREE.Vector3(bound.max.x, 0, bound.min.z);	// top-right		
			var p3 = new THREE.Vector3(bound.max.x, 0, bound.max.z);	// bottom-right				
			var p4 = new THREE.Vector3(bound.min.x, 0, bound.max.z);	// bottom-left				

			
			var posTop = new THREE.Vector3().subVectors( p2, p1 ).divideScalar( 2 ).add(p1); 
			var posBottom = new THREE.Vector3().subVectors( p3, p4 ).divideScalar( 2 ).add(p4);
			var posLeft = new THREE.Vector3().subVectors( p1, p4 ).divideScalar( 2 ).add(p4);
			var posRight = new THREE.Vector3().subVectors( p2, p3 ).divideScalar( 2 ).add(p3);
			
			var offsetLine = infProject.svg.furn.offset;
			var offsetLabel = infProject.html.furn.offset;
			
			var contour = floor.userData.room.contour;
			
			var arr = [];
			
			arr[0] = {line: offsetLine[0], posStart: posTop, dir: new THREE.Vector3(0,0,-1), html: offsetLabel[0]};
			arr[1] = {line: offsetLine[1], posStart: posBottom, dir: new THREE.Vector3(0,0,1), html: offsetLabel[1]};
			arr[2] = {line: offsetLine[2], posStart: posLeft, dir: new THREE.Vector3(-1,0,0), html: offsetLabel[2]};
			arr[3] = {line: offsetLine[3], posStart: posRight, dir: new THREE.Vector3(1,0,0), html: offsetLabel[3]};
			
			for ( var n = 0; n < arr.length; n++ )
			{
				
				var dir = arr[n].dir;
				var posStart = arr[n].posStart;
				var line = arr[n].line;
				var html = arr[n].html;
				
				hideElementSvg([line]);
				hideElementHtml([html]);
				
				for ( var i = 0; i < contour.length; i++ )
				{
					var i2 = (contour.length - 1 == i) ? 0 : i+1;

					// находим точку пересечения
					var res = crossPointTwoLine_3(posStart, posStart.clone().add(dir), contour[i], contour[i2]);								
					
					if(!res[1])
					{
						var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, 0.1) );
						
						// пересекаются ли линии
						if(CrossLine(posStart, posEnd, contour[i], contour[i2])) 
						{
							updateSvgLine({el: line, point: [posStart, res[0]]});
							showElementSvg([line]);
							
							showElementHtml([html]);

							var posLabel = new THREE.Vector3().subVectors( res[0], posStart ).divideScalar( 2 ).add(posStart); 
							html.userData.elem.pos = posLabel;	

							var dist = res[0].distanceTo(posStart);
							html.style.transform = 'translate(-50%, -50%)';
							html.textContent = Math.round(dist * 100) / 100 + '';
							
							upPosLabels_2({elem: html});
										
							break;
						}
					}				
				}							
			}
						
		}
		else
		{
			hideElementSvg(infProject.svg.furn.offset);
			hideElementHtml(infProject.html.furn.offset);
		}
		
	}
}




// перемещение по 2D плоскости 
function moveObjectPop( event )
{	
	var intersects = rayIntersect( event, planeMath, 'one' ); 
	
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

	setScalePivotGizmo();
	
	showSvgSizeObj({obj: obj});
}



function clickMouseUpObject(obj)
{ 
	if(clickO.actMove)
	{		 
		updateCubeCam({obj: obj});	// CubeCamera (material Reflection)
	}	
}


	

// удаление объекта
function deleteObjectPop(obj)
{ 
	if(obj.userData.tag != 'obj') return;
	
	clickO = resetPop.clickO(); 
	
	hidePivotGizmo(obj);
	
	var arr = [];
	
	arr[0] = obj;
	
	for(var i = 0; i < arr.length; i++)
	{	
		if(arr[i].userData.cubeCam)
		{
			deleteValueFromArrya({arr : infProject.scene.array.cubeCam, o : arr[i].userData.cubeCam});
			disposeNode( arr[i].userData.cubeCam );
			scene.remove( arr[i].userData.cubeCam );
		}
		deleteValueFromArrya({arr : infProject.scene.array.obj, o : arr[i]});
		updateListTubeUI_1({uuid: arr[i].uuid, type: 'delete'});
		disposeNode(arr[i]);
		scene.remove(arr[i]); 
	}
	
	outlineRemoveObj();
}



// скрываем Pivot/Gizmo
function hidePivotGizmo(obj)
{
	if(!obj) return;
	if(!obj.userData.tag) return;	
	//if(obj.userData.tag != 'obj') return;
	
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

	hideElementSvg(infProject.svg.furn.boxCircle);
	hideElementSvg([infProject.svg.furn.box1]);
	hideElementSvg([infProject.svg.furn.box2]);
	hideElementSvg(infProject.svg.furn.size);
	hideElementSvg(infProject.svg.furn.offset);
	
	hideElementHtml(infProject.html.furn.size);
	hideElementHtml(infProject.html.furn.offset);
	
	//clickO.obj = null;  
	clickO.last_obj = null;
	
	activeObjRightPanelUI_1(); 	// UI
	
	outlineRemoveObj();
}



 



// получаем активный объект
function getObjFromPivotGizmo(cdm)
{
	var obj = null;
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;	
	
	if(infProject.settings.active.pg == 'pivot'){ obj = pivot.userData.pivot.obj; }	
	if(infProject.settings.active.pg == 'gizmo'){ obj = gizmo.userData.gizmo.obj; }
	
	return obj;	
}





// копируем объект или группу
function copyObj(cdm) 
{
	var obj = getObjFromPivotGizmo();
	
	if(!obj) return;	
		
	var arr = [obj];		
	var arr2 = [];
	
	for(var i = 0; i < arr.length; i++)
	{ 
		var clone = arr2[arr2.length] = arr[i].clone();

		clone.userData.id = countId; countId++;
		//clone.position.add(pos);		// смещение к нулю
		infProject.scene.array.obj[infProject.scene.array.obj.length] = clone; 
		scene.add( clone );	

		updateListTubeUI_1({o: clone, type: 'add'});	// добавляем объект в UI список материалов 		
	}	
	 
	
	hidePivotGizmo(obj);
	
	clickObject3D( arr2[0] );
}



// сбрасываем rotation 
function objRotateReset(cdm)
{
	var obj = getObjFromPivotGizmo();
	
	if(!obj) return;


	var obj_1 = obj;		
	var diff_2 = obj_1.quaternion.clone().inverse();					// разница между Quaternions
	var arr_2 = [obj_1];
	
	
	// поворачиваем объекты в нужном направлении 
	for(var i = 0; i < arr_2.length; i++)
	{
		arr_2[i].quaternion.premultiply(diff_2);		// diff разницу умнажаем, чтобы получить то же угол	
		arr_2[i].updateMatrixWorld();		
	}
	
	
	var centerObj = obj_1.position.clone();
	

	// вращаем position объектов, относительно точки-соединителя
	for(var i = 0; i < arr_2.length; i++)
	{
		arr_2[i].position.sub(centerObj);
		arr_2[i].position.applyQuaternion(diff_2); 	
		arr_2[i].position.add(centerObj);
	}
	

	
	if(infProject.settings.active.pg == 'pivot'){ var tools = infProject.tools.pivot; }	
	if(infProject.settings.active.pg == 'gizmo'){ var tools = infProject.tools.gizmo; }	
}




