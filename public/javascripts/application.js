window.pmt = {
	ContactSubTab: {},

	init: function() {
		var that = this,
			tab = this.cookie.get('tab');

		if ( tab ) this.select_tab(tab);

		$('#tabs').find('a').on('click', function() {
			that.select_tab(this);
			return false;
		});

		$('#content').on('click', '.expandable', function() {
			var $this = $(this),
				$parent = $this.parent(),
				id = $parent[0].id.split('-')[1];

			if ( $this.data('expanded') ) {
				$this.data('expanded', false);
				$parent
					.animate({
						width: '-=300px',
						height: '-=200px'
					}, 500, function() {
						$(this).css({
							'border-color': 'white'
						});
					})
					.children().not('.expandable').hide();
			} else {
				$this.data('expanded', true);
				$parent
					.css({
						'border-color': '#ccc'
					})
					.animate({
						width: '+=300px',
						height: '+=200px'
					}, 500);
				
				if ( !pmt.ContactSubTab[id] ) {
					pmt.ContactSubTab[id] = new pmt.ContactSubTabView({id: id });
				} else {
					$parent.children().show();
				}
			}
		});
	},

	select_tab: function(el) {
		var isobj = typeof el == 'object',
			element = isobj ? el : document.getElementById('tab-' + el),
			id = isobj ? el.id.replace('tab-', '') : el,
			wrapper = document.getElementById(id + '-wrapper');

		$(element)
			.addClass('selected')
			.siblings().removeClass('selected');

		$('#content').find('.wrapper').not(wrapper).hide();
		wrapper.style.display = 'block';

		return isobj ? pmt.cookie.set('tab', id) : true;
	}
};

$(function() {
	pmt.init();
});
