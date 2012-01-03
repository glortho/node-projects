window.pmt = {
	init: function() {
		var that = this;
		$('#tabs').find('a').on('click', function() {
			that.select_tab(this);
			return false;
		});

		$('#content').on('click', '.expandable', function() {
			var $this = $(this),
				$parent = $this.parent(), id;

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
					.children().not('.expandable').remove();
						
				delete pmt.ContactSubTab;
			} else {
				id = $parent[0].id.split('-')[1];
				$this.data('expanded', true);
				$parent
					.css({
						'border-color': '#ccc'
					})
					.animate({
						width: '+=300px',
						height: '+=200px'
					}, 500);
				
				pmt.ContactSubTab = new pmt.ContactSubTabView({
					id: id
				});
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
