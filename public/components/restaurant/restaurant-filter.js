app.filter('searchFor', function(){
    return function(arr, searchString){
        if(!searchString){
            return;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function(item){
            if(item.name.toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }
        });
        return result;
    };
});