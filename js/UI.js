var UI = {
    scrollbarConfiguration: {
        suppressScrollX: true,
        wheelSpeed: 40
    },
    updateScrollbar: function($el) {
        $el.perfectScrollbar(UI.scrollbarConfiguration);
        $el.perfectScrollbar('update');
    },
    makeTabs: function(el) {
        var $el = $(el);
        $.each($el.find(".tabs, .horizontal-navigation, .vertical-navigation"), function(index, tabs) {
            var $tabs = $(tabs);
            $.each($tabs.find("li"), function(index, tab) {
                var $tab = $(tab);
                $tab.click(function() {
                    $.each($tabs.find("li"), function(index, otherTab) {
                        var $otherTab = $(otherTab);
                        $otherTab.toggleClass("active", otherTab === tab);
                        $(document).find('#' + $otherTab.data('tab')).toggle(otherTab === tab);
                    });
                });
                if ($tab.is(".active")) {
                    $tab.click();
                }
            });
        });
    },
};

$(function() {
    $(window).on("resize", function() {
        $.each($(".scrollbar-container"), function(index, el) {
            var $el = $(el);
            $el.perfectScrollbar(UI.scrollbarConfiguration);
            $el.perfectScrollbar('update');
        });
    });
    $(window).resize();
    UI.makeTabs($(document));
});