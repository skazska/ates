# 1. Таск-трекер

## 1.1. Таск-трекер должен быть отдельным дашбордом
Q: Task tracker board
### 1.1.1. Таск-трекер должен быть доступен всем сотрудникам компании UberPopug Inc.
A: user: admin, manager, employee
P: task-tracker board access: user: authorized
### 1.1.2. Авторизация в таск-трекере должна выполняться через общий сервис авторизации UberPopug Inc (у нас там инновационная система авторизации на основе формы клюва).
EXT: auth
### 1.1.3. В таск-трекере должны быть только задачи. Проектов, скоупов и спринтов нет, потому что они не умещаются в голове попуга.
M: task[]


## 1.2. Новые таски может создавать кто угодно (администратор, начальник, разработчик, менеджер и любая другая роль).
C: Create task
A: user: admin, manager, employee
E: Task changed (uid, status, assignee) 
### 1.2.2. У задачи должны быть описание, статус (выполнена или нет) и рандомно выбранный попуг (кроме менеджера и администратора), на которого заассайнена задача.
M: task: status(assigned, closed), assignee, description, uid
P: task assignee is random

## 1.3. Менеджеры или администраторы должны иметь кнопку «заассайнить задачи», которая возьмёт все открытые задачи и рандомно заассайнит каждую на любого из сотрудников (кроме менеджера и администратора) . Не успел закрыть задачу до реассайна — сорян, делай следующую.
C: Assign all
A: user: admin, manager
E: Task changed (uuid, status, assignee)
### 1.3.1. Ассайнить задачу можно на кого угодно (кроме менеджера и администратора), это может быть любой существующий аккаунт из системы.
P: task assignee: users except(admin, manager)
### 1.3.2. Ассайнить задачу на нового попуга, можно только кнопкой «заассайнить задачи», других вариантов нет
P: change assignee by Assign all command only
### 1.3.3. При нажатии кнопки «заассайнить задачи» все текущие не закрытые задачи должны быть случайным образом перетасованы между каждым аккаунтом в системе
F: Assign all command reassigns all tasks assignies except completed
### 1.3.4. Мы не заморачиваемся на ограничение по нажатию на кнопку «заассайнить задачи». Её можно нажимать хоть каждую секунду.
P: Assign all has no threshold
### 1.3.5. На одного сотрудника может выпасть любое количество новых задач, может выпасть ноль, а может и 10.
P: employee is not restricted in amount of assigned tasks
### 1.3.6. Создать задачу не заасайненую на пользователя нельзя. Т.е. любая задача должна иметь попуга, который ее делает
P: task assignee - not null

## 1.4. Каждый сотрудник должен иметь возможность видеть в отдельном месте список заассайненных на него задач.
Q: Own tasks board
A: roles: admin, manager, employee
M: task[]
P: user is tasks assignee
## 1.5. Каждый сотрудник должен иметь возможность отметить задачу выполненной.
C: Complete task
A: roles: admin, manager, employee
P: user is assignee
E: Task changed (uuid, status, assignee)

# 2. Аккаунтинг: кто сколько денег заработал

## 2.1. Аккаунтинг должен быть в отдельном дашборде 
Q: accounting board
A: roles: admin, manager, employee
### 2.1.1. Аккаунтинг должен быть доступным только для администраторов и бухгалтеров.
P: accounting board full access: roles: admin, manager

### 2.1.2. у обычных попугов доступ к аккаунтингу тоже должен быть. Но только к информации о собственных счетах (аудит лог + текущий баланс).
P: accounting board own account only access: roles: employee

### 2.1.3. У админов и бухгалтеров должен быть доступ к общей статистике по деньгами заработанным (количество заработанных топ-менеджментом за сегодня денег + статистика по дням).
M: top managers income: a day
### Авторизация в дешборде аккаунтинга должна выполняться через общий сервис аутентификации UberPopug Inc.
P: accounting board access: users: authorized
EXT: auth

## 2.2. У каждого из сотрудников должен быть свой счёт, который показывает, сколько за сегодня он получил денег.
M: employee balance
## 2.3. У счёта должен быть аудитлог того, за что были списаны или начислены деньги, с подробным описанием каждой из задач.
M: employee balance log: task(description, status, uid, assignee), reward or fee

## 2.4. Расценки:
### 2.4.1. цены на задачу определяется единоразово, в момент появления в системе (можно с минимальной задержкой)
#### 2.4.1.1. цены рассчитываются без привязки к сотруднику
C: Set price
A: Task changed
P: task price not exists
M: task price: task uid, reward, fee

#### 2.4.2. формула, которая говорит сколько списать денег с сотрудника при ассайне задачи — rand(-10..-20)$
F: task price fee = rand(-10..-20)

#### 2.4.3. формула, которая говорит сколько начислить денег сотруднику для выполненой задачи — rand(20..40)$
F: task price reward = rand(20..40)
E: Price set(task uid, reward, fee)

#### 2.4.4. деньги списываются сразу после ассайна на сотрудника, а начисляются после выполнения задачи.
C: Change balance
P: status is assigned
A: Task changed
E: Balance changed(employee, amount, current)

C: Change balance
P: status is completed
A: Task changed
E: Balance changed(employee, amount, current)

#### 2.4.5. отрицательный баланс переносится на следующий день. Единственный способ его погасить - закрыть достаточное количество задач в течение дня.
P: negative balance transit to next day

## 2.5. Дашборд должен выводить количество заработанных топ-менеджментом за сегодня денег.
### 2.5.1. т.е. сумма всех закрытых и заасайненых задач за день с противоположным знаком: (sum(completed task amount) + sum(assigned task fee)) * -1
F: top managers income per day = (sum(completed task amount) + sum(assigned task fee)) * -1

## 2.6. В конце дня необходимо:
### 2.6.1. считать сколько денег сотрудник получил за рабочий день
C: Pay
A: Day completed
EXT: cron
F: employee day payment = employee balance P: employee balance > 0
E: Paid
E: Day fixed P: All Pay Events processed !!!

### 2.6.2. отправлять на почту сумму выплаты.
C: Send report
P: employee day payment > 0
A: Paid
M: employee payment
E: Report sent

## 2.7. После выплаты баланса (в конце дня) он должен обнуляться, и в аудитлоге всех операций аккаунтинга должно быть отображено, что была выплачена сумма.
C: Clear balance
A: Paid
M: employee balance log: payment
E: Balance changed(employee, amount, current)

## 2.8.Дашборд должен выводить информацию по дням, а не за весь период сразу.
Q: accounting board
M: employee balance per day
M: employee balance log per day

# 3. Аналитика

## 3.1 Аналитика — это отдельный дашборд
Q: analytics dashboard
## 3.2. Аналитика доступный только админам.
A: role: admin

## 3.3. Нужно указывать, сколько заработал топ-менеджмент за сегодня и сколько попугов ушло в минус.
M: top managers income today
M: losers today: employee uid
M: losers count today = count(losers today)

C: Update top managers income today
A: Task changed
F: top managers income today = top managers income today + task fee P: Task status is assigned
F: top managers income today = top managers income today - task reward  P: Task status is completed
E: Stats updated

C: Update losers today
A: Balance changed
F: losers today = losers count today + employee uid P: employee balance < 0
F: losers today = losers count today - employee uid P: employee balance >= 0
E: Stats updated

## 3.4. Нужно показывать самую дорогую задачу за день, неделю или месяц.
M: most rewarding task: today, day, week, month

C: Update top tasks
A: Price set
F: most rewarding task today = max(task reward, most rewarding task today)
E: Stats updated


b) пример того, как это может выглядеть:

03.03 — самая дорогая задача — 28$
02.03 — самая дорогая задача — 38$
01.03 — самая дорогая задача — 23$
01-03 марта — самая дорогая задача — 38$


C: Fix stats
A: Day fixed
F: aggregate today values to day, week, month, clear today values
E: Stats updated
