app.angular.module('libra.post').controller('PopoverDemoCtrl', function ($scope) {
  $scope.dynamicPopover = {
    content: 'content',
    templateUrl: 'Job Discription',
    title: 'Headline'
  };

  $scope.placement = {
    options: [
      'Admin-office',
      'Customer Service',
      'Education',
      'Engineering',
      'Finance',
      'Food',
      'General Labor',
      'Government',
      'healthcare',
      'human resource',
      'legal',
      'marketing',
      'media',
      'reale state',
      'sales',
      'security',
      'software',
      'tech support',
      'transport',
      'TV'
    ],
    selected: 'top'
  };
});