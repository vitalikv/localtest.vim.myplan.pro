

var arrImg_1 = null;
var arrImg_2 = null;



// screenshot
function createImageScene() 
{ 

	try 
	{	
		showHidePoint({visible: false});
		var background = scene.background.clone();
		scene.background = new THREE.Color( 0xffffff );
		infProject.scene.grid.visible = false;
		infProject.settings.shader.fxaaPass.enabled = true;
		renderer.render( scene, camera );
		
		var strMime = "image/png";
		var imgData = renderer.domElement.toDataURL(strMime);	

		showHidePoint({visible: true});
		scene.background = background;
		infProject.scene.grid.visible = true;
		infProject.settings.shader.fxaaPass.enabled = false;
		renderer.render( scene, camera );
 
				
		if(camera == camera3D)
		{
			openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");
		}
		else
		{	
			var svg = document.querySelector('#svgFrame');
			var canvas = document.createElement("canvas");
			canvas.width = svg.clientWidth;
			canvas.height = svg.clientHeight;
			var ctx = canvas.getContext("2d");
			var DOMURL = self.URL || self.webkitURL || self;
			var img = new Image(); 

			img.onload = function() 
			{
				arrImg_1 = img;
				assemblyImage();
			};
			img.src = imgData;
		}		
	} 
	catch (e) 
	{
		console.log(e);
		return;
	}
}



function showHidePoint(cdm)
{
	if(camera == camera3D) return;
	
	var point = infProject.scene.array.point;
	
	for( var i = 0; i < point.length; i++ )
	{
		point.visible = cdm.visible;
	}
}


// screenshot сохраняем в bd
function saveAsImagePreview() 
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
		console.log(e);
		return null;
	}
}




// открыть или сохранить screenshot
var openFileImage = function (strData, filename) 
{
	var link = document.createElement('a');
	
	if(typeof link.download === 'string') 
	{		
		document.body.appendChild(link); //Firefox requires the link to be in the body
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link); //remove the link when done
	} 
	else 
	{
		location.replace(uri);
	}
}; 





// конвертация image в base64 (строка)
function convertImgToBase64(src, callback) 
{
	var image = new Image();
	image.crossOrigin = 'Anonymous';
 
	image.onload = function() {
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		canvas.height = this.naturalHeight;
		canvas.width = this.naturalWidth;		
		context.fillStyle = '#fff';  /// set white fill style
		context.fillRect(0, 0, canvas.width, canvas.height);		
		context.drawImage(this, 0, 0);
		var dataURL = canvas.toDataURL('image/jpeg', 0.7);	 console.log(dataURL);	
		callback(dataURL);
	};

	image.src = src;
}




function createImageSvg() 
{
	if(camera == camera3D) return;
	
	var arr = [];
	var svg = document.querySelector('#svgFrame');

	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < wall.length; i++ )
	{ 		
		if(wall[i].userData.wall.html.label)
		{
			for ( var i2 = 0; i2 < wall[i].userData.wall.html.label.length; i2++ )
			{
				var label = wall[i].userData.wall.html.label[i2]
				//wall[i].userData.wall.html.label[i2].remove();
				var txt  = document.createElementNS(infProject.settings.svg.tag, "text");								
				
				var x = label.userData.elem.x;
				var y = label.userData.elem.y;				
				
				var translate = 'translate('+ ((label.clientWidth/2)*-1) +',0)';
				var rotate = 'rotate('+THREE.Math.radToDeg(label.userData.elem.rot)+','+(x+(label.clientWidth/2)*-1)+','+(y+label.clientHeight/2)+')';
				
				var transform = translate;
				var str = label.innerText;
				
				txt.setAttribute('x', x);
				txt.setAttribute('y', y);
				txt.setAttribute('fill', '#000');
				txt.setAttribute('transform', transform);
				txt.setAttribute('dominant-baseline', 'baseline');
				txt.textContent = str;

				svg.appendChild(txt);
				
				arr[arr.length] = txt;
			}
		}					
	}



	
	svg.setAttribute('width', svg.clientWidth);
	svg.setAttribute('height', svg.clientHeight);
	var svgString = new XMLSerializer().serializeToString(svg);

	console.log(svgString);

	var canvas = document.createElement("canvas");
	canvas.width = svg.clientWidth;
	canvas.height = svg.clientHeight;
	var ctx = canvas.getContext("2d");
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);

	img.onload = function() 
	{				
		if(1==2)
		{
			ctx.drawImage(img, 0, 0);
			
			var strMime = "image/png";
			var imgData = canvas.toDataURL(strMime);	
			console.log(imgData);

			openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");	

			DOMURL.revokeObjectURL(imgData);
		}
		else
		{
			arrImg_2 = img;
			assemblyImage();			
		}
	};
	img.src = url;	
	

	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].remove();
	}	
}


// собираем 2 изображение в одно
function assemblyImage() 
{	
	if(arrImg_1 && arrImg_2)
	{
		console.log(arrImg_1);
		console.log(arrImg_2);
		
		var svg = document.querySelector('#svgFrame');
		var canvas = document.createElement("canvas");
		canvas.width = svg.clientWidth;
		canvas.height = svg.clientHeight;
		var ctx = canvas.getContext("2d");

		ctx.drawImage(arrImg_1, 0, 0);
		ctx.drawImage(arrImg_2, 0, 0);

		var strMime = "image/png";
		var imgData = canvas.toDataURL(strMime);	

		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");	

		var DOMURL = self.URL || self.webkitURL || self;
		DOMURL.revokeObjectURL(imgData);

		arrImg_1 = null;
		arrImg_2 = null;
	}
}



// создаем изображение из svg элемнтов на странице
function createImageFromSvg() 
{

	var svg = document.querySelector('#svgFrame');
	svg.setAttribute('width', svg.clientWidth);
	svg.setAttribute('height', svg.clientHeight);
	var svgString = new XMLSerializer().serializeToString(svg);

	console.log(svgString);

	var canvas = document.createElement("canvas");
	canvas.width = svg.clientWidth;
	canvas.height = svg.clientHeight;
	var ctx = canvas.getContext("2d");
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);

	img.onload = function() 
	{
		ctx.drawImage(img, 0, 0);
		
		var strMime = "image/png";
		var imgData = canvas.toDataURL(strMime);	
		console.log(imgData);

		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");	

		DOMURL.revokeObjectURL(imgData);
	};
	img.src = url;	

}








