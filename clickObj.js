



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
		//pivot.userData.pivot.axs.y.visible = false;
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
	
	setScalePivotGizmo();
	
	if(camera == cameraTop) { outlineRemoveObj(); }
	if(camera == camera3D) { outlineAddObj({arr: [obj]}); }
	
	activeObjRightPanelUI_1({obj: obj});	// показываем меню UI

	showSvgSizeObj({obj: obj, boxCircle: true, getObjRoom: true, resetPos: true});
	
	getLotIdObject3D(obj.userData.obj3D.lotid);
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
	
	showSvgSizeObj({obj: obj, boxCircle: true, setPos: { pos2D: new THREE.Vector2(event.clientX, event.clientY), pos3D: intersects[ 0 ].point }});
}



function clickMouseUpObject(obj)
{ 
	if(clickO.actMove)
	{		 
		updateCubeCam({obj: obj});	// CubeCamera (material Reflection)
		
		if(camera == cameraTop)
		{			
			var circle = infProject.svg.furn.boxCircle;	

			for ( var i = 0; i < circle.length; i++ )
			{
				var x = ( ( circle[i].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
				var y = - ( ( circle[i].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
				var A = new THREE.Vector3(x, y, -1);
				A.unproject(camera);
				
				circle[i].userData.svg.circle.pos = A;
				
				//updateSvgCircle({el: circle[i]});
			}
			
			// box1
			{	
				var arrP = [];
				var box1 = infProject.svg.furn.box1; 
				
				for ( var i = 0; i < box1.pathSegList.length; i++ )
				{
					var x = ( ( box1.pathSegList[i].x - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
					var y = - ( ( box1.pathSegList[i].y - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
					var A = new THREE.Vector3(x, y, -1);
					A.unproject(camera);

					arrP[arrP.length] = A;
				}	
						
				arrP[arrP.length] = arrP[0];
				
				box1.userData.svg.path.arrP = arrP;
				//updateSvgPath({el: box1});
			}
			
			// box2
			{	
				var arrP = [];
				var box2 = infProject.svg.furn.box2; 
				
				for ( var i = 0; i < box2.pathSegList.length; i++ )
				{
					var x = ( ( box2.pathSegList[i].x - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
					var y = - ( ( box2.pathSegList[i].y - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
					var A = new THREE.Vector3(x, y, -1);
					A.unproject(camera);

					arrP[arrP.length] = A;
				}	
						
				arrP[arrP.length] = arrP[0];
				
				box2.userData.svg.path.arrP = arrP;
				//updateSvgPath({el: box2});
			}


			// offsetLine
			upSvgLinePosScene({el: infProject.svg.furn.offset});
			upSvgLinePosScene({el: infProject.svg.furn.size});
			
			
			if(1==2)
			{
				infProject.calc.boxScale2D.sizeLine = null;
				infProject.calc.boxScale2D.boxCircle = null;
				infProject.calc.boxScale2D.box1 = null;
				infProject.calc.boxScale2D.box2 = null;
				infProject.calc.boxScale2D.offsetLine = null;
				
				infProject.calc.boxScale2D.box1 = {pos: {screen: new THREE.Vector2(), scene: new THREE.Vector3()}};
				infProject.calc.boxScale2D.box1.pos.screen = [];
				
				for ( var i = 0; i < box1.pathSegList.length; i++ )
				{
					infProject.calc.boxScale2D.box1.pos.screen = [];
				}				
				
			}
		}
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
	//clone.position.add(pos);		// смещение к нулю
	infProject.scene.array.obj[infProject.scene.array.obj.length] = clone; 
	scene.add( clone );	

	//updateListTubeUI_1({o: clone, type: 'add'});	// добавляем объект в UI список материалов 		
	 
	
	//hidePivotGizmo(obj);
	//clickObject3D({obj: clone, rayhit: {point: clone.position}});	
	//clickO.last_obj = clone;
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




