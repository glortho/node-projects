window.pmt = {
	ContactSubTab: {},

	init: function() {
		var that = this;
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
		var id = el.id.replace('tab-', ''),
			wrapper = document.getElementById(id + '-wrapper');

		$(el)
			.addClass('selected')
			.siblings().removeClass('selected');

		$('#content').find('.wrapper').not(wrapper).hide();
		wrapper.style.display = 'block';
	}
};

$(function() {
	pmt.init();
});
