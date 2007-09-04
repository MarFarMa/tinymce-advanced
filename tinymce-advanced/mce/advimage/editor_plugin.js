/**
 * $Id: editor_plugin_src.js 201 2007-02-12 15:56:56Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright � 2004-2007, Moxiecode Systems AB, All rights reserved.
 */

// UK lang variables
tadvmce = realTinyMCE;
tadvmce.addToLang('advimage',{
tab_general : 'General',
tab_appearance : 'Appearance',
tab_advanced : 'Advanced',
general : 'General',
title : 'Title',
preview : 'Preview',
constrain_proportions : 'Constrain proportions',
langdir : 'Language direction',
langcode : 'Language code',
long_desc : 'Long description link',
style : 'Style',
classes : 'Classes',
ltr : 'Left to right',
rtl : 'Right to left',
id : 'Id',
image_map : 'Image map',
swap_image : 'Swap image',
alt_image : 'Alternative image',
mouseover : 'for mouse over',
mouseout : 'for mouse out',
misc : 'Miscellaneous',
example_img : 'Appearance&nbsp;preview&nbsp;image',
missing_alt : 'Are you sure you want to continue without including an Image Description? Without  it the image may not be accessible to some users with disabilities, or to those using a text browser, or browsing the Web with images turned off.'
});

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('advimage');

var TinyMCE_AdvancedImagePlugin = {
	getInfo : function() {
		return {
			longname : 'Advanced image',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/advimage',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "image":
				return tinyMCE.getButtonHTML(cn, 'lang_image_desc', '{$themeurl}/images/image.gif', 'mceAdvImage');
		}

		return "";
	},

	execCommand : function(editor_id, element, command, user_interface, value) {
		switch (command) {
			case "mceAdvImage":
				var template = new Array();

				template['file']   = tinyMCE.baseURL + '/../../../wp-content/plugins/tinymce-advanced/mce/advimage/image.htm';
				template['width']  = 480;
				template['height'] = 380;

				// Language specific width and height addons
				template['width']  += tinyMCE.getLang('lang_advimage_delta_width', 0);
				template['height'] += tinyMCE.getLang('lang_advimage_delta_height', 0);

				var inst = tinyMCE.getInstanceById(editor_id);
				var elm = inst.getFocusElement();

				if (elm != null && tinyMCE.getAttrib(elm, 'class').indexOf('mceItem') != -1)
					return true;

				tinyMCE.openWindow(template, {editor_id : editor_id, inline : "yes"});

				return true;
		}

		return false;
	},

	cleanup : function(type, content) {
		switch (type) {
			case "insert_to_editor_dom":
				var imgs = content.getElementsByTagName("img"), src, i;
				for (i=0; i<imgs.length; i++) {
					var onmouseover = tinyMCE.cleanupEventStr(tinyMCE.getAttrib(imgs[i], 'onmouseover'));
					var onmouseout = tinyMCE.cleanupEventStr(tinyMCE.getAttrib(imgs[i], 'onmouseout'));

					if ((src = this._getImageSrc(onmouseover)) != "") {
						if (tinyMCE.getParam('convert_urls'))
							src = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], src);

						imgs[i].setAttribute('onmouseover', "this.src='" + src + "';");
					}

					if ((src = this._getImageSrc(onmouseout)) != "") {
						if (tinyMCE.getParam('convert_urls'))
							src = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], src);

						imgs[i].setAttribute('onmouseout', "this.src='" + src + "';");
					}
				}
				break;

			case "get_from_editor_dom":
				var imgs = content.getElementsByTagName("img");
				for (var i=0; i<imgs.length; i++) {
					var onmouseover = tinyMCE.cleanupEventStr(tinyMCE.getAttrib(imgs[i], 'onmouseover'));
					var onmouseout = tinyMCE.cleanupEventStr(tinyMCE.getAttrib(imgs[i], 'onmouseout'));

					if ((src = this._getImageSrc(onmouseover)) != "") {
						if (tinyMCE.getParam('convert_urls'))
							src = eval(tinyMCE.settings['urlconverter_callback'] + "(src, null, true);");

						imgs[i].setAttribute('onmouseover', "this.src='" + src + "';");
					}

					if ((src = this._getImageSrc(onmouseout)) != "") {
						if (tinyMCE.getParam('convert_urls'))
							src = eval(tinyMCE.settings['urlconverter_callback'] + "(src, null, true);");

						imgs[i].setAttribute('onmouseout', "this.src='" + src + "';");
					}
				}
				break;
		}

		return content;
	},

	handleNodeChange : function(editor_id, node, undo_index, undo_levels, visual_aid, any_selection) {
		if (node == null)
			return;

		do {
			if (node.nodeName == "IMG" && tinyMCE.getAttrib(node, 'class').indexOf('mceItem') == -1) {
				tinyMCE.switchClass(editor_id + '_advimage', 'mceButtonSelected');
				return true;
			}
		} while ((node = node.parentNode));

		tinyMCE.switchClass(editor_id + '_advimage', 'mceButtonNormal');

		return true;
	},

	/**
	 * Returns the image src from a scripted mouse over image str.
	 *
	 * @param {string} s String to get real src from.
	 * @return Image src from a scripted mouse over image str.
	 * @type string
	 */
	_getImageSrc : function(s) {
		var sr, p = -1;

		if (!s)
			return "";

		if ((p = s.indexOf('this.src=')) != -1) {
			sr = s.substring(p + 10);
			sr = sr.substring(0, sr.indexOf('\''));

			return sr;
		}

		return "";
	}
};

tinyMCE.addPlugin("advimage", TinyMCE_AdvancedImagePlugin);
