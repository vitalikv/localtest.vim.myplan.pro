

// создаем svg елемент
function createSvgLine(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var line  = document.createElementNS("http://www.w3.org/2000/svg", "line");

		line.setAttribute("x1", 100);
		line.setAttribute("y1", 300);

		line.setAttribute("x2", 600);
		line.setAttribute("y2", 300);
		line.setAttribute("stroke-width", "2px");
		
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



// обновляем положение svg на экране
function updateSvgLine(cdm)
{
	var line = cdm.line;
	
	if(cdm.point)
	{
		line.userData.svg.line.p = cdm.point;
	}
	
	var p = line.userData.svg.line.p;
	
	//camera.updateProjectionMatrix();
	var tempV = p[0].clone().project(camera);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	line.setAttribute("x1", x);
	line.setAttribute("y1", y);
	
	var tempV = p[1].clone().project(camera);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	line.setAttribute("x2", x);
	line.setAttribute("y2", y);		
	
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





