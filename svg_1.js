



// создаем svg line елемент
function createSvgLine(cdm)
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


// создаем svg circle елемент
function createSvgCircle(cdm)
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
		
		//circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
		circle.setAttribute("display", "none");
		
		circle.userData = {};
		circle.userData.svg = {};
		circle.userData.svg.circle = {};
		//circle.userData.svg.circle.r = 300;
		circle.userData.svg.circle.pos = new THREE.Vector3();
		circle.userData.svg.show = false;		

		svg.appendChild(circle);
		
		infProject.svg.arr[infProject.svg.arr.length] = circle;
		arr[arr.length] = circle;		
	}
	
	return arr;		
}



// создаем svg контур из линий
function createSvgPath(cdm)
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



// обновляем положение svg на экране
function updateSvgLine(cdm)
{
	var el = cdm.el;
	
	if(cdm.point)
	{
		el.userData.svg.line.p = cdm.point;
	}
	
	var p = el.userData.svg.line.p;
	
	//camera.updateProjectionMatrix();
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



// обновляем положение svg на экране
function updateSvgCircle(cdm)
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



// обновляем положение svg на экране
function updateSvgPath(cdm)
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





// обновляем значение svg в 3D сцене
function upSvgLinePosScene(cdm)
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






// показываем svg элементы
function showElementSvg(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].setAttribute("display", "block");
	}	
}


// скрываем svg элементы
function hideElementSvg(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].setAttribute("display", "none");
	}	
}






// назначаем события для svg элемнтов (точеки масшатабирования объекта)
function assignEventSvgScaleSizeObj(cdm)
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
				clickElementBoxScale({event: event, elem: this});
				event.stopPropagation();
			}
		);			
	}
 
}














