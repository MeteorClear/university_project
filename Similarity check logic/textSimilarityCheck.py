
title_list = []

# 레벤슈타인 거리 계산
def levenshtein_distance(str1, str2):
    x = str1.lower()
    y = str2.lower()
    m = len(str1)
    n = len(str2)

    weight = 1.0
    adjusted_length_diff = abs(m - n) * weight

    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1

    return dp[m][n] + adjusted_length_diff



# 인덱스를 문자열로 복원
def find_text(text_list, compare_list):
    text_list_find = []
    for idx, distance in text_list:
        text_list_find.append(compare_list[idx])
    return text_list_find



# 거리별로 정렬
def distance_sort(distance_list, count=None):
    distance_list.sort(key = lambda x : x[1])
    count_list = list()

    if count == None:
        return distance_list
    
    for i in range(count):
        idx, distance = distance_list[i]
        count_list.append((idx, distance))

    return count_list



# 문자열간 유사도 리스트를 생성
def text_similarity(target_text, compare_list):
    if len(target_text) < 1 or len(compare_list) < 1:
        raise
    
    similar_list = []
    
    for (idx, text) in enumerate(compare_list):
        distance = levenshtein_distance(target_text, text)
        similar_list.append((idx, distance))
    
    return similar_list



# 보정 가중치를 더함
def correct_weight(target_text, compare_list, similar_list, mul_weight=1):
    len_max = -1
    for t in compare_list:
        len_max = max(len_max, len(t))

    correct_list = []

    for idx, distance in similar_list:
        text = compare_list[idx]
        pos = text.find(target_text)
        adder = 0
        len_weight = abs(len_max - len(text)) * 2

        if pos >= 0:
            adder = len(target_text) * mul_weight

        correct_list.append((idx, distance - adder + len_weight))
    return correct_list



# 텍스트간 유사도 추정
def text_similarity_process(target_text, compare_list, count=None, mul_weight=10):
    if len(target_text) < 1 or len(compare_list) < 1:
        return (False, None, None)
    similar_list = []
    try:
        similar_list = text_similarity(target_text, compare_list)
    except:
        return (False, None, None)
    
    correct_list = []
    try:
        correct_list = correct_weight(target_text, compare_list, similar_list, mul_weight)
    except:
        return (False, None, None)
    
    sort_list = []
    try:
        sort_list = distance_sort(correct_list, count)
    except:
        return (False, None, None)
    
    text_list = []
    try:
        text_list = find_text(sort_list, compare_list)
    except:
        return (False, None, None)
    
    return (True, text_list, sort_list)
