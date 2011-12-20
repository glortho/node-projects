window.pmt = {
	init: function() {
		var that = this;
		$('#tabs').find('a').on('click', function() {
			that.select_tab(this);
			return false;
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
