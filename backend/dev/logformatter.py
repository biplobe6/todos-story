from sqlformatter import SqlFormatter as Formatter
import time


def get_time():
    ctime = "[ {} ]".format(time.ctime())
    return ctime.center(60, '-')


class SqlFormatter(Formatter):
    def format(self, record):
        formatted_msg = super(SqlFormatter, self).format(record)
        msg = "{}\n".format(get_time())
        msg += formatted_msg
        msg += "\nduration: {}\n".format(record.duration)
        return msg


