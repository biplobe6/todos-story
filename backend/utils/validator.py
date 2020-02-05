from rest_framework.exceptions import ValidationError

class Validator:
    def __init__(self):
        self.error_found = False
        self.error = {}

    def add_error(self, field, error):
        if not self.error_found:
            self.error_found = True
        if field not in self.error:
            self.error[field] = []
        self.error[field].append(error)

    def is_valid(self, raise_error=True):
        if self.error_found and raise_error:
            raise ValidationError(self.error)
        return not self.error_found




class FieldValidator:
    def __init__(self, data, key, validator):
        self.data = data
        self.key = key
        self.validator = validator
        self.pre_check()

    def pre_check(self):
        pass

