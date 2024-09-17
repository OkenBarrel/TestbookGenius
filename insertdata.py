import pymysql
import random
import json

# 连接数据库
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='Milky18874',
    database='textbook',
    charset='utf8mb4'
)

# 数据库游标
cursor = connection.cursor()

# 生成500本图书
# try:
#     books = []
#     for i in range(1, 501):
#         isbn = f"9737601{i:05d}"  # 简单生成唯一的ISBN
#         title = f"书名{i}"
#         author = json.dumps([f"作者{i}"], ensure_ascii=False)
#         publisher = "出版社" + str(random.randint(1, 10))
#         pubdate = f"202{random.randint(0, 3)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
#         cover = f"https://img1.doubanio.com/view/subject/s/public/s34894009.jpg"
#         douban_url = f"https://book.douban.com/subject/{random.randint(1000000, 9999999)}/"
#         books.append((isbn, title, author, publisher, pubdate, cover, douban_url))

# # 插入图书数据
#         cursor.executemany("INSERT INTO api_book (isbn, title, author, publisher, pubdate, cover, douban_url) \
#                         VALUES (%s, %s, %s, %s, %s, %s, %s)", books)
# except Exception:
#     pass

# 生成300名教师
# try:
#     teachers = []
#     for i in range(1, 301):
#         teacher_name = f"老师{i}"
#         teachers.append((teacher_name))
#     cursor.executemany("INSERT INTO api_teacher (teacher_name) VALUES (%s)", teachers)
# except Exception:
#     pass

# 生成500门课程
# try:
#     courses = []
#     for i in range(1, 501):
#         course_name = f"课程{i}"
#         department = "文法学部"
#         courses.append((course_name, department))
#     cursor.executemany("INSERT INTO api_course (course_name, department) VALUES (%s, %s)", courses)
# except Exception:
#     pass

# 获取所有课程ID和教师ID
cursor.execute("SELECT id FROM api_teacher")
teacher_ids = [row[0] for row in cursor.fetchall()]
# print(teacher_ids)
cursor.execute("SELECT id FROM api_course")
course_ids = [row[0] for row in cursor.fetchall()]
cursor.execute("SELECT isbn FROM api_book")
book_ids=[row[0] for row in cursor.fetchall()]
# 每门课程分配随机的老师和一本书
usebook=[]
for i, course_id in enumerate(course_ids):
    # 随机分配1到3个老师
    # try:
    teacher_subset = random.sample(teacher_ids, random.randint(1, 3))
    book=random.choice(book_ids)
    for teacher_id in teacher_subset:
        usebook.append((f"202{random.randint(0, 3)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",1,book,course_id, teacher_id))
    # 每门课程关联一本唯一的书
    # usebook.append((course_id, books[i][0]))  # 第i门课程对应第i本书的ISBN

# 插入课程教师关系
cursor.executemany("INSERT INTO api_usebook (school_year,semester,book_id,course_id, teacher_id) \
                   VALUES (%s, %s,%s,%s,%s)", usebook)



# 提交并关闭
connection.commit()
cursor.close()
connection.close()
'''
{
    "book": {
        "isbn": "9787101162097",
        "title": "儒教中国及其现代命运",
        "author": ["[美] 列文森"],
        "publisher": "中华书局",
        "pubdate": "2024-6",
        "cover": "https://img1.doubanio.com/view/subject/s/public/s34894009.jpg",
        "douban_url": "https://book.douban.com/subject/36884135/"
    },
    "teacher": {
        "teacher_name":"历史老师"
    },
    "course": {
        "course_name": "历史",
        "department":"文法学部"
    },
    "school_year":"2012-2013",
    "semester":1
}

'''
