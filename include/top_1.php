



<div class="flex_1 top_panel_2">	
	
	<div class="toolbar" data-action ='top_panel_1'>		
		<div class="button1-wrap-1" nameId='butt_main_load_obj'>
			<div class="button1 button_gradient_1"> 
				<img src="img/download_1.png">
			</div>	
		</div>		
		<div class="button1-wrap-1" nameId='butt_main_sett'>
			<div class="button1 button_gradient_1"> 
				<img src="img/settings_1.png">
			</div>	
		</div>	

		<div class="button1-wrap-1" nameId='zoom_camera_butt_m'>
			<div class="button1 button_gradient_1" style="width: 19px;"> 
				-
			</div>	
		</div>
		<div class="button1-wrap-1" nameId='zoom_camera_butt_p'>
			<div class="button1 button_gradient_1" style="width: 19px;"> 
				+
			</div>	
		</div>
		<div class="button1-wrap-1">
			<div nameId='screenshot' class="button1 button_gradient_1"><img src="img/screenshot.png"></div>
		</div>		
	</div> 
	
	<div class="tp_right_1">
	
		<select nameId="camera_button" class="select-css">
			<option value ="2D">камера 2D</option>
			<option value ="3D">камера 3D</option>
		</select>	
		
	</div>
	
</div>




<div class="window_main_sett" nameId="window_main_sett" ui_1="" style="display: none;">
	<div class="modal_window_close" nameId="button_close_main_sett">
		+
	</div>
	<div class='modal_body'>
		<div style="font-size: 16px; font-family: arial,sans-serif; color: #666; margin: 30px;">
			<div>
				<input type="checkbox" nameId="checkbox_light_global" checked> Глобальный свет
			</div>	
			<div>
				<input type="checkbox" nameId="checkbox_fxaaPass"> Сглаживание 
			</div>
		</div>			
	</div>
</div>	



<div class="window_main_load_obj" nameId="window_main_load_obj" ui_1="" style="display: none;">
	<div class="modal_window_close" nameId="button_close_main_load_obj">
		+
	</div>
	<div style="width: 80%; height: 160px; margin: auto; padding-top: 30px;">

		<input name="file" type="file" id="load_obj_1" class="input_load_substrate">
		<label for="load_obj_1" class="button1 button_gradient_1" style="margin: auto;">
			загрузить с вашего компьютера
		</label>

		<div style="font-size: 20px; font-family: arial,sans-serif; color: #666; margin: 10px auto; text-align:center;">
			или
		</div>
		
		<div class="flex_1">		
			<input type="text" nameId="input_link_obj_1" value="">			
		</div>
		
		<div class="button1 button_gradient_1" nameId='butt_load_obj_2'>загрузить по ссылке</div>
	</div>			
</div>	





<div style="position: absolute; width: 100%; bottom: 110px; z-index: 2;" nameId="menu_loader_slider_UI">		
	
	<div style="width: 260px; height: 60px; margin: auto; padding-bottom: 30px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);">
	
		<div style="padding: 15px 0 0 0; font-size: 18px; text-align: center; color: #666;">
			Загрузка объектов
		</div>
		
		<div style="padding: 15px 0; font-size: 16px; text-align: center; color: #666;" nameId="txt_loader_slider_UI">
			0%
		</div>
		
	</div>
	
</div>

	

