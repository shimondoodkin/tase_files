/* list of exp days */
select expday from `tasefiles` where monthweek="m" group by expday order by expday desc;

/* count of days in an exp day*/
select count(*) from (select day from `tasefiles` where expday=20150625 and monthweek="m" group by day) dd;

/*
days and count of stocks for each day
*/
select day,count(id) from `tasefiles` where expday=20150625 and monthweek="m" group by day;

/*
min max during all days
*/
select derid
,max(`der-02-Highest Price`) as high
,ifnull( min(case `der-02-Lowest Price` when 0 then NULL else `der-02-Lowest Price` END  ) ,0) as low
from `tasefiles` where expday=20150625 and monthweek="m" group by derid;

/*previous day */
select day from `tasefiles` where expday=20150625 and monthweek="m" group by day order by day desc limit 1);

/* previous  exp*/
select expday from `tasefiles` where monthweek="m" and expday< 20150625 group by expday order by expday desc limit 1;

/* min max from previous  exp*/
select derid
,min(day)
,max(day)
,max(`der-02-Highest Price`) as high
,ifnull( min(case `der-02-Lowest Price` when 0 then NULL else `der-02-Lowest Price` END  ) ,0) as low
from `tasefiles` where expday=20150625 and monthweek="m"
and day> (
select expday from `tasefiles` where monthweek="m" and expday< 20150625 group by expday order by expday desc limit 1
)
group by derid;


/* min max of previous day*/
select derid
,min(day)
,max(day)
,max(`der-02-Highest Price`) as high
,ifnull( min(case `der-02-Lowest Price` when 0 then NULL else `der-02-Lowest Price` END  ) ,0) as low
from `tasefiles` where expday=20150625 and monthweek="m"
and day= (
select day from `tasefiles` where monthweek="m" and expday=20150625 group by day order by day desc limit 1
)
group by derid;





/* both combined 'last day low hight'  and  'from perv exp day to exp low high' */
select a.derid,b.minday as pexp_minday,b.maxday as pexp_maxday ,b.count as pexp_count,b.high as pexp_high,b.low as pexp_low,a.day as last_day,a.high as last_high,a.low as last_low from 
(
/* min max from previous  exp*/
select derid
,min(day) as minday
,max(day) as maxday
,count(id) as count
,max(`der-02-Highest Price`) as high
,ifnull( min(case `der-02-Lowest Price` when 0 then NULL else `der-02-Lowest Price` END  ) ,0) as low
from `tasefiles` where expday=20150625 and monthweek="m"
and day> (
select expday from `tasefiles` where monthweek="m" and expday< 20150625 group by expday order by expday desc limit 1
)
group by derid
) b
,
(
/* min max of previous day*/
select derid
,day as day
,max(`der-02-Highest Price`) as high
,ifnull( min(case `der-02-Lowest Price` when 0 then NULL else `der-02-Lowest Price` END  ) ,0) as low
from `tasefiles` where expday=20150625 and monthweek="m"
and day= (
select day from `tasefiles` where monthweek="m" and expday=20150625 group by day order by day desc limit 1
)
group by derid
) a
where  a.derid=b.derid

