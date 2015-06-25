angular.module('blogController', [])

	// inject the Blog service factory into our controller
	.controller('mainController', ['$scope','$http','Blogs', function($scope, $http, Blogs) {

		$scope.blogData = {};
		$scope.loading = true;
		$scope.limit = 3;
		$scope.tagFilter = 'ALL';
		$scope.searchText = '';
		var tagArray = [];
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var months =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		// GET =====================================================================
		// when landing on the page, get all blogs and show them
		// use the service to get all the blogs
		Blogs.get()
			.success(function(data) {
				$scope.loading = false;
				$scope.blogs = data;
			});

		function taggingSplit() {
			tagArray = [];
    		var str = $scope.tags;
    		if ( str === '' || str === undefined  ){return}
    		tagArray = str.split(/[ ,]+/);
    			
		}

		$scope.filterTag = function( tag ){
			$scope.tagFilter = tag;
			$scope.limit = 3;
		};

		$scope.clearSearch = function() {
			$scope.searchText = '';
		};

		$scope.createBlog = function() {
				if ($scope.loading || $scope.blogData.title==='' || $scope.blogData.title===undefined) {
					return;
				}
				$scope.loading = true;
				var date = new Date();
				taggingSplit();
				$scope.blogData['createdDate'] = date;
				$scope.blogData['date'] = days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' (' + date.getHours() + ':' + date.getMinutes() + ')';
				$scope.blogData['tags'] = tagArray;

				// call the create function from our service (returns a promise object)
				Blogs.create($scope.blogData)

					// if successful creation, call our get function to get all the new blogs
					.success(function(data) {
						$scope.tags = '';
						$scope.loading = false;
						$scope.blogData = {}; // clear the form so our user is ready to enter another
						$scope.blogs = data; // assign our new list of blogs
					});
		};

		$scope.deleteBlog = function(id) {
			$scope.loading = true;
			Blogs.delete(id)
				// if successful creation, call our get function to get all the new blogs
				.success(function(data) {
					$scope.loading = false;
					$scope.blogs = data; // assign our new list of blogs
				});
		};
		

	}]);