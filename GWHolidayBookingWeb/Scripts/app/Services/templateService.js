templateService = function ($http, $compile, $templateCache) {
    return {
        getTemplate: function (templateUrl) {
            return $http.get(templateUrl, {
                cache: $templateCache
            });
        },
        cacheTemplate: function (templateUrl, template) {
            $templateCache.put(templateUrl, template);
        },
        compileTemplate: function (template, scope) {
            var compiledTemplate = $compile(template);
            return compiledTemplate(scope);
        },
        renderTemplate: function (target, html, append) {
            var element = angular.element(target);
            if (append == true)
                element.append(html);
            else
                element.html(html);
        },
        addTemplate: function (templateUrl, target, scope, callback, append) {
            var service = this;
            service.getTemplate(templateUrl).success(function (template) {
                service.cacheTemplate(templateUrl, template);
                var html = service.compileTemplate(template, scope);
                service.renderTemplate(target, html, append);
                if (callback)
                    callback();
            }).error(function (data, status, headers, config) {
                throw (data);
            });
        }
    };
}
