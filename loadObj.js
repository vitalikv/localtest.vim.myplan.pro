


async function getListObjTypesApi()
{	
	var arr = [];		



	if(1==1)
	{
		arr[arr.length] =
		{
			lotid : 257,
			name : 'окно 1',
			type: 'window', 
			planeMath : 1.5, 
		};

		arr[arr.length] =
		{
			lotid : 256,
			name : 'дверь',
			type: 'door',
			planeMath : 0.1,
		};
		
		arr[arr.length] =
		{
			lotid : 255,
			name : 'light',
			type: 'light point',
			planeMath : 0.1,
		};		

		arr[arr.length] =
		{
			lotid : 257,
			name : 'окно 22',
			planeMath : 1.5,
		};		
	};	

	
	infProject.catalog.obj = arr;
	addObjInCatalogUI_1(); 
	
}




function infoListTexture()
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





async function loadObjServer(cdm)
{ 
	// cdm - информация, которая пришла из вне
	// inf - статическая инфа из базы
	//console.log(cdm);
	
	if(!cdm.lotid) return;
	
	var lotid = cdm.lotid;	
	
	var inf = await getObjFromBase({lotid: lotid});
	
	//console.log(11111111, inf, cdm);
	
	if(cdm.loadFromFile){ inf.obj = null; }
	
	if(inf.obj)		// объект есть в кэше
	{ 		
		if(inf.obj) 
		{ 
			inf.obj = inf.obj.clone(); 
			addObjInScene(inf, cdm); 
		}
	}
	else		// объекта нет в кэше
	{
		var fl = false;
		if(cdm.type)
		{
			if(cdm.type == 'wd'){ fl = true; }
		}
		
		if(cdm.loadFromFile){}
		else if (fl) {}
		else { createSpotObj(inf, cdm); }
		
		var loader = new THREE.GLTFLoader();
		loader.load( inf.url, function ( object ) 						
		{ 
			var obj = object.scene.children[0];				
			
			var obj = addObjInBase(inf, obj);
			
			if(cdm.loadFromFile)	// загрузка из сохраненного файла json 
			{
				loadObjFromBase({lotid: lotid, furn: cdm.furn});
			}
			else					// добавляем объект в сцену 
			{
				inf.obj = obj;
				
				addObjInScene(inf, cdm);							
			}
		});					
	}
	
	
}





// ищем был ли до этого объект добавлен в сцену (если был, то береме сохраненную копию)
async function getObjFromBase(cdm)
{
	var lotid = cdm.lotid;								// объекты в сцене 
	var base = infProject.scene.array.base;		// объекты в памяти	
	
	for(var i = 0; i < base.length; i++)
	{
		if(base[i].lotid == lotid)
		{
			return base[i];
		}
	}
	
	
	var url = infProject.settings.api.inf.item+lotid+'/';
	
	var response = await fetch(url, { method: 'GET' });
	var json = await response.json();
		
	var inf = { lotid: lotid, planeMath : 0.0, spot: json.spot, height: json.height, url: infProject.settings.api.inf.models+json.model };
	
	
	return inf;
}



// добавляем новый объект в базу объектов (добавляются только уникальные объекты, кторых нет в базе)
function addObjInBase(inf, obj)
{
	obj.geometry.computeBoundingBox();	
	
	// накладываем на материал объекта lightMap
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 			
			if(infProject.settings.obj.material.texture == 'none')
			{
				child.material.map = null;
				child.material.color = new THREE.Color(infProject.settings.obj.material.color);				
			}

			child.castShadow = true;	
			child.receiveShadow = true;				
		}
	});	
	
	var inf_2 = JSON.parse( JSON.stringify( inf ) );
	inf_2.obj = obj.clone();
	
	infProject.scene.array.base[infProject.scene.array.base.length] = inf_2;
	
	return obj;
}



// создаем слепок объекта
function createSpotObj(inf, cdm)
{ 
	if(!inf.spot) return;
	if(!inf.spot.coordinates) return;
	
	var v = inf.spot.coordinates[0];
	var height = (inf.height) ? inf.height : 0.1;
	
	var point = [];
	for ( var i = 0; i < v.length - 1; i++ ) 
	{  
		point[i] = new THREE.Vector2 ( v[i][0], v[i][1] );
		if(cdm.scale)
		{
			point[i].x *= cdm.scale.x;
			point[i].y *= cdm.scale.z;
		}
	}

	if(cdm.scale) { height *= cdm.scale.y; }
	
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



// удаление пятно объекта
function deleteSpotObj(cdm)
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
	
	deleteValueFromArrya({arr: infProject.scene.array.objSpot, o: obj});
	disposeNode(obj);
	scene.remove(obj); 
}



// добавляем объект в сцену
function addObjInScene(inf, cdm)
{
	// загрузка wd
	if(cdm.wd)
	{  
		setObjInWD(inf, cdm);
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
	
	//if(cdm.rot){ obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z); }					
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
	
	// получаем начальные размеры объекта, что потом можно было масштабировать от начальных размеров
	if(1==1)
	{
		var x = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var y = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;
		var z = obj.geometry.boundingBox.max.z - obj.geometry.boundingBox.min.z;	
		obj.userData.obj3D.box = new THREE.Vector3(x, y, z);
	}	
	
	if(cdm.scale){ obj.scale.set(cdm.scale.x, cdm.scale.y, cdm.scale.z); }

	if(inf.type)
	{
		if(inf.type == 'light point')
		{
			var intensity = 1;
			if(cdm.light)
			{
				if(cdm.light.intensity) { intensity = cdm.light.intensity; }
			}
			setLightInobj({obj: obj, intensity: intensity}); 
		}
	}
	
	obj.material.visible = false;

	
	// CubeCamera
	//checkReflectionMaterial({obj: obj});			
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );		
	
	if(cdm.cursor) 	// объект был добавлен в сцену из каталога
	{ 
		deleteSpotObj({obj: clickO.move});
		clickO.move = obj; 
	} 
	else	// объект был добавлен в сцену из сохраннего файла
	{
		deleteSpotObj({id: obj.userData.id});
	}
	
	renderCamera();
}


// добавлеям к светильнику источник света
function setLightInobj(cdm)
{
	var obj = cdm.obj;
	obj.userData.obj3D.typeGroup = 'light point';
	
	
	var light = new THREE.PointLight( 0xffffff, cdm.intensity, 10 );
	
	light.castShadow = true;            // default false
	scene.add( light );
	
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			child.castShadow = false;	
			child.receiveShadow = false;				
		}
	});	
	
	light.decay = 2;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1048;  // default
	light.shadow.mapSize.height = 1048; // default
	light.shadow.camera.near = 0.01;       // default
	light.shadow.camera.far = 10;      // default
	
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
		
		console.log('spotLight', spotLight);
		//--------

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


// определяем нужно ли для объекта устанавливать отражение, если да, то ставим CubeCamera
function checkReflectionMaterial(cdm)
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

	if(arrCubeO.length > 0) createCubeCam({obj: obj, arrO: arrCubeO});		
	
}


function createCubeCam(cdm)
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
					//child.material.specular = new THREE.Color(0xffffff);
					//child.material.shininess = 100;
					//child.material.envMapIntensity = 2;
					//child.material.color = new THREE.Color(0xffffff);
					child.material.metalness = 1;
					child.material.roughness = 0;
					//child.material.reflectivity = 1;
				}								
			}				
		}
	});	
	
	updateCubeCam({obj: obj});
}


function updateCubeCam(cdm)
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




function loadInputFile(cdm)
{

	if(1==1)	// gltf/glb
	{
		var loader = new THREE.GLTFLoader();
		loader.parse( cdm.data, '', function ( obj ) 						
		{ 
			//var obj = obj.scene.children[0];
			setParamObj({obj: obj.scene});
		});
		
	}
	else	// fbx
	{
		var loader = new THREE.FBXLoader();
		var obj = loader.parse( cdm.data );		
		setParamObj({obj: obj});			
	}


}


function loadUrlFile()
{	
	var url = $('[nameId="input_link_obj_1"]').val(); 
	var url = url.trim();
	
	// /import/furn_1.fbx 
	// /import/vm_furn_3.glb
	// /import/80105983_krovat_dafna5.glb
	
	if(1==1)	// gltf/glb
	{
		var loader = new THREE.GLTFLoader();
		loader.load( url, function ( obj ) 						
		{ 
			//var obj = obj.scene.children[0];
			setParamObj({obj: obj.scene});
		});			
	}
	else	// fbx
	{
		var loader = new THREE.FBXLoader();
		loader.load( url, function ( obj ) 						
		{ 			
			setParamObj({obj: obj});
		});			
	}
}





function setParamObj(cdm)
{
	$('[nameId="window_main_load_obj"]').css({"display":"none"});
	//resetScene();
	
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
 
	
	
	// накладываем тени
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
	
	
	// CubeCamera
	checkReflectionMaterial({obj: obj});

	
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

		// Parse the input and generate the glTF output
		exporter.parse( [obj], function ( gltf ) 
		{
			
			var link = document.createElement( 'a' );
			link.style.display = 'none';
			document.body.appendChild( link );			
			
			if ( gltf instanceof ArrayBuffer ) 
			{ 
				console.log( gltf ); 
				link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'application/octet-stream' } ) );
				link.download = 'file.glb';				
			}
			else
			{
				console.log( gltf );
				var gltf = JSON.stringify( gltf, null, 2 );
				
				link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'text/plain' } ) );
				link.download = 'file.gltf';				
			}

			link.click();			
			
		}, options );
		
	}
	
	//clickO.move = obj;
	
	renderCamera();	
}








