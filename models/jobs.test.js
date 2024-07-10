"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./jobs");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  jobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const newJob = {
  title: "newJob",
  salary: 50000,
  equity: 0.05,
  companyHandle: "c1",
};

describe("create", function () {
  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      id: expect.any(Number),
      title: "newJob",
      salary: 50000,
      equity: "0.05",
      companyHandle: "c1",
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
       FROM jobs
       WHERE title = 'newJob'`
    );
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        title: "newJob",
        salary: 50000,
        equity: "0.05",
        companyHandle: "c1",
      },
    ]);
  });
});

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "newtitle",
        salary: 50000,
        equity: "0.05",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "othertitle",
        salary: 60000,
        equity: "0.0",
        companyHandle: "c2",
      },
    ]);
  });

  test("works: by min salary", async function () {
    let jobs = await Job.findAll({ minSalary: 55000 });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "othertitle",
        salary: 60000,
        equity: "0.0",
        companyHandle: "c2",
      },
    ]);
  });

  test("works: by title", async function () {
    let jobs = await Job.findAll({ title: "othertitle" });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "othertitle",
        salary: 60000,
        equity: "0.0",
        companyHandle: "c2",
      },
    ]);
  });

  test("works: by equity", async function () {
    let jobs = await Job.findAll({ hasEquity: true });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "newtitle",
        salary: 50000,
        equity: "0.05",
        companyHandle: "c1",
      },
    ]);
  });
});

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(`${jobIds[0]}`);
    expect(job).toEqual({
      id: jobIds[0],
      title: "newtitle",
      salary: 50000,
      equity: "0.05",
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("update", function () {
  const updateData = {
    title: "UpdatedTitle",
    salary: 70000,
    equity: 0.1,
  };

  test("works", async function () {
    let job = await Job.update(`${jobIds[0]}`, updateData);
    expect(job).toEqual({
      id: jobIds[0],
      title: "UpdatedTitle",
      salary: 70000,
      equity: "0.1",
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(9999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("doesn't change ID or companyHandle", async function () {
    const jobBefore = await Job.get(`${jobIds[0]}`);
    const updatedJob = await Job.update(`${jobIds[0]}`, { title: "NewTitle" });

    expect(updatedJob.id).toEqual(jobBefore.id);
    expect(updatedJob.companyHandle).toEqual(jobBefore.companyHandle);
  });
});

describe("remove", function () {
  test("works", async function () {
    await Job.remove(`${jobIds[0]}`);
    const res = await db.query(`SELECT id FROM jobs WHERE id=${jobIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
