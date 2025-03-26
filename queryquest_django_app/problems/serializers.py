from rest_framework import serializers
class ProblemSerializer(serializers.ModelSerializer):
    # Instead of just returning the ID, return the string representation
    unit = serializers.StringRelatedField()  
    class Meta:
        model = Problem
        fields = '__all__'