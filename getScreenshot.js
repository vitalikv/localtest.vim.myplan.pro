



// screenshot
function saveAsImage() 
{ 
createImage();
return;

	try 
	{	
		var background = scene.background.clone();
		scene.background = new THREE.Color( 0xffffff );
		infProject.scene.grid.visible = false;
		infProject.settings.shader.fxaaPass.enabled = true;
		//renderer.antialias = true;
		renderer.render( scene, camera );
		
		var strMime = "image/png";
		var imgData = renderer.domElement.toDataURL(strMime);	

		//renderer.antialias = false;
		scene.background = background;
		infProject.scene.grid.visible = true;
		infProject.settings.shader.fxaaPass.enabled = false;
		renderer.render( scene, camera );
 
		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");
	} 
	catch (e) 
	{
		console.log(e);
		return;
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




function createImage() 
{

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
			}
		}					
	}

	console.log(wall[0].userData.wall.html.label[0]);
	console.log(wall[0].userData.wall.html.label[0].style.transform);
	console.log(wall[0].userData.wall.html.label[0].style.top);
	console.log(wall[0].userData.wall.html.label[0].innerText);
	console.log(wall[0].userData.wall.html.label[0].offsetLeft);
	console.log(wall[0].userData.wall.html.label[0].offsetTop);


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








