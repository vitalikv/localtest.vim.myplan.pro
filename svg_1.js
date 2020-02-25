


function createSvgLine(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var svg = document.querySelector('#svgFrame');
	
	var line  = document.createElementNS("http://www.w3.org/2000/svg", "line");

	line.setAttribute("x1", 100);
	line.setAttribute("y1", 300);

	line.setAttribute("x2", 600);
	line.setAttribute("y2", 300);
	line.setAttribute("stroke-width", "4px");
	
	if(cdm.color){ line.setAttribute("stroke", cdm.color); }
	else { line.setAttribute("stroke", "#ff0000"); }
	

	svg.appendChild(line);
	
	return line;
}


function updateSvgLine(cdm)
{
	var line = cdm.line;
	var p = cdm.point;
	
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



