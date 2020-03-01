



function clickElementBoxScale(cdm)
{
	var event = cdm.event;
	var elem = cdm.elem;
	
	var pos = getScreenMousePosition(event);
	
	clickO.elem = elem;
	
	var circle = infProject.svg.furn.boxCircle;
	
	// infProject.svg.furn.boxCircle раположение точек масштаба на экране
	// 0 top-left
	// 1 top-center
	// 2 top-right
	
	// 3 bottom-left
	// 4 bottom-center
	// 5 bottom-right		
	
	// 6 left-center
	// 7 right-center		
	
	
	var inf = { p2: null};
	
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
	

	var dir = new THREE.Vector2(elem.cx.baseVal.value - inf.start.cx.baseVal.value, elem.cy.baseVal.value - inf.start.cy.baseVal.value).normalize();
	var rad = Math.atan2(dir.x, dir.y) - Math.PI/2;
	
	elem.userData.svg.circle.inf = {x: {}, z: {}, start: {}, dir: dir, rad: rad};
	
	elem.userData.svg.circle.inf.start.el = inf.start;
	elem.userData.svg.circle.inf.start.dir = new THREE.Vector2(elem.cx.baseVal.value - inf.start.cx.baseVal.value, elem.cy.baseVal.value - inf.start.cy.baseVal.value).normalize();
	
	elem.userData.svg.circle.inf.x.el = inf.x.o2;
	elem.userData.svg.circle.inf.x.dir = new THREE.Vector2(inf.x.o2.cx.baseVal.value - inf.x.o1.cx.baseVal.value, inf.x.o2.cy.baseVal.value - inf.x.o1.cy.baseVal.value).normalize();
	
	elem.userData.svg.circle.inf.z.el = inf.z.o2;
	elem.userData.svg.circle.inf.z.dir = new THREE.Vector2(inf.z.o2.cx.baseVal.value - inf.z.o1.cx.baseVal.value, inf.z.o2.cy.baseVal.value - inf.z.o1.cy.baseVal.value).normalize();

	elem.userData.svg.circle.inf.half = inf.half;
}





function moveElement(e)
{
	var elem = clickO.elem;
	var pos = getScreenMousePosition(e);
	
	var inf = elem.userData.svg.circle.inf;
	
	// равномерное перемещение по осям xz
	if(1==1)
	{
		var el = inf.start.el;
		var dir = inf.start.dir; 
		var rad = inf.rad; 
		
		var pos2 = new THREE.Vector2(pos.x - el.cx.baseVal.value, -(pos.y - el.cy.baseVal.value));

		var dx = new THREE.Vector2();
		dx.x = pos2.x * Math.cos(rad) - pos2.y * Math.sin(rad);
		dx.y = pos2.x * Math.sin(rad) + pos2.y * Math.cos(rad);	
		
		var pos2 = new THREE.Vector2(dir.x * dx.x, dir.y * dx.y);
		
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = new THREE.Vector3(pos.x, 0, pos.y);
		
		var pos = spPoint(A,B,C);
		
		//console.log(new THREE.Vector3().subVectors( A, B ).normalize());
		
		elem.setAttributeNS(null, "cx", pos.x);
		elem.setAttributeNS(null, "cy", pos.z);				
		
	}

	// перемещаем соседние точки
	if(inf.x)
	{
		var el = inf.x.el;
		var dir = inf.x.dir;
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = pos;
		
		var pos2 = spPoint(A,B,C);	

		el.setAttributeNS(null, "cx", pos2.x);
		el.setAttributeNS(null, "cy", pos2.z);
	}

	// перемещаем соседние точки
	if(inf.z)
	{
		var el = inf.z.el;
		var dir = inf.z.dir;
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = pos;
		
		var pos2 = spPoint(A,B,C);	

		el.setAttributeNS(null, "cx", pos2.x);
		el.setAttributeNS(null, "cy", pos2.z);
	}

	// перемещаем соседние точки
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
	
	
	e.stopPropagation();	
}



