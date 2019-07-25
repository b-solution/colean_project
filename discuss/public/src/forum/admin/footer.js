var discuss_admin = (function(discuss_admin) {

	discuss_admin.config = undefined;

	discuss_admin.prepare = function() {
		// Come back in 500ms if the config isn't ready yet
		if (discuss_admin.config === undefined) {
			setTimeout(function() {
				discuss_admin.prepare();
			}, 500);
			return;
		}

		// Populate the fields on the page from the config
		var fields = document.querySelectorAll('#content [data-field]'),
			numFields = fields.length,
			saveBtn = document.getElementById('save'),
			x, key, inputType;
		for (x = 0; x < numFields; x++) {
			key = fields[x].getAttribute('data-field');
			inputType = fields[x].getAttribute('type');
			if (fields[x].nodeName === 'INPUT') {
				if (discuss_admin.config[key]) {
					switch (inputType) {
						case 'text':
						case 'textarea':
						case 'number':
							fields[x].value = discuss_admin.config[key];
							break;

						case 'checkbox':
							fields[x].checked = discuss_admin.config[key] === '1' ? true : false;
							break;
					}
				}
			} else if (fields[x].nodeName === 'TEXTAREA') {
				if (discuss_admin.config[key]) fields[x].value = discuss_admin.config[key];
			}
		}

		saveBtn.addEventListener('click', function(e) {
			var key, value;
			e.preventDefault();

			for (x = 0; x < numFields; x++) {
				key = fields[x].getAttribute('data-field');
				if (fields[x].nodeName === 'INPUT') {
					inputType = fields[x].getAttribute('type');
					switch (inputType) {
						case 'text':
						case 'number':
							value = fields[x].value;
							break;

						case 'checkbox':
							value = fields[x].checked ? '1' : '0';
							break;
					}
				} else if (fields[x].nodeName === 'TEXTAREA') {
					value = fields[x].value;
				}

				socket.emit('api:config.set', {
					key: key,
					value: value
				});
			}
		});
	}

	discuss_admin.remove = function(key) {
		socket.emit('api:config.remove', key);
	}


	jQuery('document').ready(function() {
		// On menu click, change "active" state
		var menuEl = document.querySelector('.sidebar-nav'),
			liEls = menuEl.querySelectorAll('li')
			parentEl = null;

		menuEl.addEventListener('click', function(e) {
			parentEl = e.target.parentNode;
			if (parentEl.nodeName === 'LI') {
				for (var x = 0, numLis = liEls.length; x < numLis; x++) {
					if (liEls[x] !== parentEl) jQuery(liEls[x]).removeClass('active');
					else jQuery(parentEl).addClass('active');
				}
			}
		}, false);
	});

	socket.once('api:config.get', function(config) {
		discuss_admin.config = config;
	});

	socket.emit('api:config.get');

	socket.on('api:config.set', function(data) {
		if (data.status === 'ok') {
			app.alert({
				alert_id: 'config_status',
				timeout: 2500,
				title: 'Changes Saved',
				message: 'Your changes to the discuss configuration have been saved.',
				type: 'success'
			});
		} else {
			app.alert({
				alert_id: 'config_status',
				timeout: 2500,
				title: 'Changes Not Saved',
				message: 'discuss encountered a problem saving your changes',
				type: 'danger'
			});
		}
	});

	return discuss_admin;

}(discuss_admin || {}));
